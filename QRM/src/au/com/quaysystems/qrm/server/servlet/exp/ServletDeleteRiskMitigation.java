package au.com.quaysystems.qrm.server.servlet.exp;

import java.util.HashMap;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hibernate.Session;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import au.com.quaysystems.qrm.dto.ModelMitigationStepNoPerson;

@SuppressWarnings("serial")
@WebServlet (value = "/deleteRiskMitigation", asyncSupported = false)
public class ServletDeleteRiskMitigation extends QRMRPCServlet {

	@Override
	void execute(HttpServletRequest request, HttpServletResponse response,
			Session sess, Long userID, HashMap<String, String> stringMap,
			HashMap<Object, Object> objMap, Long projectID, Long riskID) {

		boolean ext = stringMap.containsKey("EXT");

		if (!checkUpdateSecurity(riskID, userID, request)) {
			if (ext){
				this.outputJSON(false, response);
			} else {
				outputJSON(getRisk(riskID, userID, projectID, sess),response);				
			}
			return;
		}

		try {
			for (Object obj : (JSONArray) parser.parse(stringMap.get("DATA"))) {
				Long id = null;
				if (ext){
					id = this.getLongJS(((JSONObject)obj).get("mitstepID"));
				} else {
					id = (Long)obj;
				}
				ModelMitigationStepNoPerson step = (ModelMitigationStepNoPerson)sess.get(ModelMitigationStepNoPerson.class,id);
				sess.beginTransaction();
				sess.delete(step);
				sess.getTransaction().commit();
			}
		} catch(Exception e){
			log.error("QRM Stack Trace", e);
		}

		// Would prefer this to be in the database, but this is a tidy up to remove any mitigation step updates when the 
		// mitigation step is removed
		sess.createSQLQuery("DELETE FROM updatecomment WHERE hostID NOT IN (SELECT mitStepID FROM mitigationstep) AND hostType = 'MITIGATION'").executeUpdate();
		outputJSON(getRisk(riskID, userID,projectID, sess),response);
		notifyUpdate(Long.parseLong(stringMap.get("RISKID")),request);


	}
}
