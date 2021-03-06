package au.com.quaysystems.qrm.server.servlet.exp;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.Date;
import java.util.Map;
import java.util.Properties;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.ConcurrentHashMap;

import javax.servlet.AsyncContext;
import javax.servlet.AsyncEvent;
import javax.servlet.AsyncListener;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;

import au.com.quaysystems.qrm.Member;
import au.com.quaysystems.qrm.server.servlet.SessionControl;

/*
 *  Each time the client issues a poll request, the time is recorded so that 
 *  stale polling sessions can be cleaned up by a timer task. 
 */
@SuppressWarnings("serial")

@WebServlet(urlPatterns = "/pollNG/*", asyncSupported = true)
public class ServletUserMessageManager extends HttpServlet{


	private Properties configProp = new Properties();
	private int sessionTimeout;
	public static ConcurrentHashMap<String, Member> sessionMemberMap = new ConcurrentHashMap<String, Member>();
	private static  Map<String, AsyncContext> asyncContexts = new ConcurrentHashMap<String, AsyncContext>();
	private static Logger log = Logger.getLogger("au.com.quaysystems.qrm");
	static Integer CLEANUP_INITIAL_DELAY = 60000;
	static Integer CLEANUP_FREQUENCY = 60000;
	static Integer POLL_NO_REFRESH_TIMEOUT = 90000;

	@Override
	public void init(final ServletConfig sc){
		log.info("User Message Manager Processor Started");

		InputStream in;
		try {
			in = new FileInputStream(sc.getServletContext().getRealPath("/QRM.properties"));
			try {
				configProp.load(in);
			} catch (IOException e) {
				log.error("QRM Stack Trace", e);
			}
		} catch (FileNotFoundException e1) {
			log.error("QRM Stack Trace", e1);
		}


		try {

			CLEANUP_INITIAL_DELAY = Integer.parseInt(configProp.getProperty("CLEANUP_INITIAL_DELAY",CLEANUP_INITIAL_DELAY.toString()));
			CLEANUP_FREQUENCY = Integer.parseInt(configProp.getProperty("CLEANUP_FREQUENCY",CLEANUP_FREQUENCY.toString()));
			POLL_NO_REFRESH_TIMEOUT = Integer.parseInt(configProp.getProperty("POLL_NO_REFRESH_TIMEOUT",POLL_NO_REFRESH_TIMEOUT.toString()));
			
			System.out.println("Initial delay before starting clean up task (s): "+CLEANUP_INITIAL_DELAY/1000);
			System.out.println("Frequency of clean up task (s): "+CLEANUP_FREQUENCY/1000);
			System.out.println("No Poll Refresh timeout (s): "+POLL_NO_REFRESH_TIMEOUT/1000);
			
			try {
				sessionTimeout = Integer.parseInt(configProp.getProperty("SESSION_TIMEOUT"));
			} catch (NumberFormatException e) {
				sessionTimeout = 600;
			}
			
			System.out.println("Session timeout (s): "+sessionTimeout);
			
			new Timer().schedule(new CleanUpTask(), CLEANUP_INITIAL_DELAY, CLEANUP_FREQUENCY);
		} catch (Exception e) {
			log.error("Could not start Cleanup Timer Task");
			log.error("QRM Stack Trace", e);
		}
	}

	private static void SOP(String string) {
//		System.out.println(">>>>> "+string);
//		log.debug(string);
	}

	public void service(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {

		String riskIDStr = req.getParameter("riskID");
		if (riskIDStr != null){
			if (riskIDStr.startsWith("null")){
				riskIDStr ="0";
			}
		} else {
			riskIDStr = "0";
		}

		Long riskID = 0L;
		try {
			riskID = Long.parseLong(riskIDStr);
		} catch (NumberFormatException e1) {
			riskID = 0L;
		}
		final String sessID = req.getSession().getId();


		// Register interest in a risk
		try {
			if (req.getParameter("action").equals("registerRisk")){
				SOP("Registering interest in Risk: "+riskID);
				Member member = sessionMemberMap.get(sessID);
				if (member != null){
					try {
						member.riskID = riskID;
						member.lastRequest = new Date().getTime();
					} catch (Exception e) {
						member.riskID = null;
					}
				}

				return;
			} else if (!req.getParameter("action").equals("poll")){
				return;
			}
		} catch (Exception e) {
			log.error("QRM Stack Trace", e);
		}

		final String userID = req.getParameter("userID");
		Member member = sessionMemberMap.get(sessID);

		if (member != null ){
			if (userID.equalsIgnoreCase("null")) {
				//Indicates that the user client has been shut down or logged off.
				sendMessage(res.getWriter(), "{\"logout\":\"true\"}");
				AsyncContext ac = asyncContexts.get(sessID);
				if (ac != null){
					ac.complete();
				}
				expireSession(sessID);
				return;
			}
			member.lastRequest = new Date().getTime();

		} else if ( userID != null){
			member = new Member();
			member.sessionID = sessID;
			member.userID = Long.parseLong(userID);
			member.lastRequest = new Date().getTime();
			member.riskID = riskID;
			sessionMemberMap.put(sessID, member);
		}

		SOP("Registering Chat Channel "+ sessID);

		final AsyncContext ctx = req.startAsync(req, res);
		asyncContexts.put(sessID, ctx);
		ctx.setTimeout(23000);
		ctx.addListener(new AsyncListener() {

			@Override
			public void onComplete(AsyncEvent event) throws IOException {
				SOP("onComplete Called");
				asyncContexts.remove(sessID);
			}

			@Override
			public void onTimeout(AsyncEvent event) throws IOException {
				try {
					AsyncContext ac = asyncContexts.get(sessID);
					if (ac != null) {
						HttpSession httpSess = ((HttpServletRequest) ac.getRequest()).getSession();
						
						Long lastTrans = (Long) httpSess.getAttribute("LAST_QRM_TRANSACTION");
						
						// First, check if the user has been inactive (i.e. not running any transactions)
						if (lastTrans != null) {
							if ((new Date().getTime() - lastTrans) > (1000 * sessionTimeout)) {
								sendMessage(ac, "{\"sessionexpire\":\"true\"}");
								expireSession(sessID);
							} else {
								SOP("Sending Timeout Message");
								sendMessage(ac, "{\"timeout\":\"true\"}");
							}
						} else if (SessionControl.sessionMap.get(sessID) != null) {
							
							// Signal the client the if the session has been disabled
							if(!SessionControl.sessionMap.get(sessID).sessionEnabled){
								sendMessage(ac, "{\"sessionexpire\":\"true\"}");
								expireSession(sessID);
							} else {
								
								//send a timeout message.
								SOP("Sending Timeout Message");
								sendMessage(ac, "{\"timeout\":\"true\"}");
							}
						}
						ac.complete();
					}
				} catch (Exception e) {
					e.printStackTrace();
				}
			}

			@Override
			public void onError(AsyncEvent event) throws IOException {
				asyncContexts.remove(sessID);
			}
			@Override
			public void onStartAsync(AsyncEvent event) throws IOException {
			}
		});				

		try {
			if (member.queue.size() > 0){
				String message = member.queue.poll();
				sendMessage(ctx, message);
				ctx.complete();
			}
		} catch (Exception e) {
			e.printStackTrace();
			SOP("Error in Non Zero Queue Processing");
		}
	}

	private static void sendMessage(final AsyncContext ac, final String message) throws IOException{
		if (ac != null){
			sendMessage(ac.getResponse().getWriter(), message);
		}
	}
	private static void sendMessage(PrintWriter writer, String message) throws IOException {
		writer.print(message);
		writer.flush();
	}
	private static void expireSession(String sessID){
		try {
			sessionMemberMap.remove(sessID);
			System.out.println("### SessionControl ###  Expiring Session "+sessID);
			SessionControl.sessionMap.remove(sessID);
			SessionControl.logEndSession(sessID);
		} catch (Exception e) {
			log.error("QRM Stack Trace", e);
		}

	}
	public static synchronized void sendBroadcastMessage(String message) throws IOException	{
		for (AsyncContext ac:asyncContexts.values()){
			sendMessage(ac, "{\"message\":\""+message+"\"}");
			ac.complete();
		}
	}
	public static synchronized void notifyReportStatus(Long userID) throws IOException	{

		for (Member m : sessionMemberMap.values()){

			if (!m.userID.equals(userID)){
				continue;
			}

			AsyncContext ac = asyncContexts.get(m.sessionID);
			if (ac != null){
				sendMessage(ac, "{\"reportupdate\":\"true\"}");
				ac.complete();
			} else {
				m.queue.add("{\"reportupdate\":\"true\"}");
			}
		}
	}
	public static synchronized void notifyRiskUpdate(Long riskID, String jSess) throws IOException	{
		for (Member m:sessionMemberMap.values()){			
			if (m.riskID == null || m.riskID.longValue() != riskID.longValue() || jSess.equals(m.sessionID)){
				continue;
			} else {
				AsyncContext ac = asyncContexts.get(m.sessionID);
				if (ac != null){
					sendMessage(ac, "{\"riskupdate\":\"true\"}");
					ac.complete();
				}else {
					m.queue.add("{\"riskupdate\":\"true\"}");
				}
			}
		}
	}
	private static class CleanUpTask extends TimerTask {
		public void run() {
			try {
				
				long limit = new Date().getTime() - POLL_NO_REFRESH_TIMEOUT;

				for( String key :  (String [])sessionMemberMap.keySet().toArray(new String[sessionMemberMap.keySet().size()])) {
					
					Member m = sessionMemberMap.get(key);

					if (m != null ){
						if ((m.lastRequest.longValue() < limit) && m.browserSession ){
							synchronized(sessionMemberMap){
								Member sessionRecord = sessionMemberMap.get(key);
								if (sessionRecord == null){
									continue;
								} else {
									expireSession(key);
								}
							}
						}
					}
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}
	public static void recordSessionAccess(String id) {
		sessionMemberMap.get(id).lastRequest = new Date().getTime();
	}
}

