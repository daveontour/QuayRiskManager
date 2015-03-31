package au.com.quaysystems.qrm.server.servlet.exp;

import java.sql.Connection;
import java.util.HashMap;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hibernate.Session;
import org.json.simple.JSONArray;

@SuppressWarnings("serial")
@WebServlet (value = "/removeAttachments", asyncSupported = false)
public class ServletRemoveAttachments extends QRMRPCServlet {

	@Override
	void execute(HttpServletRequest request, HttpServletResponse response,
			Session sess, Long userID, HashMap<String, String> stringMap,
			HashMap<Object, Object> objMap, Long projectID, Long riskID) {


		if (riskID != null){
			if (!checkUpdateSecurity(riskID, userID, request)) {
				if(stringMap.containsKey("EXT")){
					outputJSON(false, response);
				} else {
					outputJSON(getRisk(riskID, userID, projectID, sess),response);
				}
				return;
			}
		}

		try (Connection conn = getSessionConnection(request)){
			conn.setAutoCommit(true);
			for (Object x : (JSONArray) parser.parse(request.getParameter("DATA"))) {
				conn.createStatement().executeUpdate("DELETE FROM attachment WHERE internalID = "+ (Long)x);
			}
		} catch (Exception e) {
			log.error("QRM Stack Trace", e);
		}

		outputJSON(getRisk(riskID, userID, projectID, sess),response);

	}
}
