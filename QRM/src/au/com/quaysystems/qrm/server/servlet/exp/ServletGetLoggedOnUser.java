package au.com.quaysystems.qrm.server.servlet.exp;

import java.util.HashMap;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hibernate.CacheMode;
import org.hibernate.FlushMode;
import org.hibernate.Session;

import au.com.quaysystems.qrm.server.PersistenceUtil;

@SuppressWarnings("serial")
@WebServlet (value = "/getLoggedOnUser", asyncSupported = false)
public class ServletGetLoggedOnUser extends QRMRPCServlet {

	@Override
	void execute(HttpServletRequest request, HttpServletResponse response,
			Session sess, Long userID, HashMap<String, String> stringMap,
			HashMap<Object, Object> objMap, Long projectID, Long riskID) {

		Session sess2 = PersistenceUtil.getSimpleControlSession();
		sess2.setCacheMode(CacheMode.IGNORE);
		sess2.setFlushMode(FlushMode.ALWAYS);

		try {
			outputJSON2B(getPerson(userID, sess),response);
		} catch (Exception e) {
			log.error("QRM Stack Trace", e);
		} finally {
			sess2.close();
		}

	}
}
