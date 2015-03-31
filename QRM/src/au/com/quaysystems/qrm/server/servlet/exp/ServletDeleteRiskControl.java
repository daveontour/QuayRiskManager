package au.com.quaysystems.qrm.server.servlet.exp;

import java.util.HashMap;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hibernate.Session;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import au.com.quaysystems.qrm.dto.ModelRiskControl;

@SuppressWarnings("serial")
@WebServlet (value = "/deleteRiskControl", asyncSupported = false)
public class ServletDeleteRiskControl extends QRMRPCServlet {

	@Override
	void execute(HttpServletRequest request, HttpServletResponse response,
			Session sess, Long userID, HashMap<String, String> stringMap,
			HashMap<Object, Object> objMap, Long projectID, Long riskID) {

		// Check if the user has update rights to the risk.
		if (!checkUpdateSecurity(riskID, userID, request)) {
			if (stringMap.containsKey("EXT")){
				this.outputJSON(false, response);
			} else {
				outputJSON(getRisk(riskID, userID, projectID, sess),response);				
			}
			return;
		}
		try {
			for (Object obj : (JSONArray) parser.parse(stringMap.get("DATA"))) {
				
				Long id = null;
				if (stringMap.containsKey("EXT")){
					JSONObject objJS = (JSONObject)obj;
					id = this.getLongJS(objJS.get("internalID"));
				} else {
					id = (Long)obj;
				}

				ModelRiskControl control = (ModelRiskControl)sess.load(ModelRiskControl.class,id);
				sess.beginTransaction();
				sess.delete(control);
				sess.getTransaction().commit();
			}
		} catch(Exception e){
			log.error("QRM Stack Trace", e);
			if (stringMap.containsKey("EXT")){
				this.outputJSON(false, response);
			} else {
				outputJSON(getRisk(riskID, userID, projectID, sess),response);				
			}
			return;
		}
		outputJSON(getRisk(riskID, userID,projectID, sess),response);
		notifyUpdate(Long.parseLong(stringMap.get("RISKID")),request);

	}
}
