package au.com.quaysystems.qrm.server.servlet.exp;

import java.util.Date;
import java.util.HashMap;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hibernate.Session;
import org.hibernate.Transaction;
import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;

import au.com.quaysystems.qrm.dto.ModelMitigationStep;

@SuppressWarnings("serial")
@WebServlet (value = "/newRiskMitigation", asyncSupported = false)
public class ServletNewRiskMitigation extends QRMRPCServlet {

	@Override
	void execute(HttpServletRequest request, HttpServletResponse response,
			Session sess, Long userID, HashMap<String, String> stringMap,
			HashMap<Object, Object> objMap, Long projectID, Long riskID) {

		boolean ext = stringMap.containsKey("EXT");

		if (!checkUpdateSecurity(riskID, userID, request)) {
			if (ext){
				outputJSON(false, response);
			} else {
				outputJSON(getRisk(riskID, userID, projectID, sess),response);
			}
			return;
		}

		if (ext){

			try {
				JSONObject mitJS = (JSONObject)parser.parse(stringMap.get("MITIGATION"));
				Long mitID = getLongJS(mitJS.get("mitstepID"));
				
				if (mitID < 0){
					Transaction tx = sess.beginTransaction();
					ModelMitigationStep step = new ModelMitigationStep();
					step.setResponse(false);
					step.personID = userID;
					step.setEstimatedCost(getDoubleJS(mitJS.get("estCost")));
					step.setPercentComplete(getDoubleJS(mitJS.get("percentComplete")));
					step.setEndDate(df.parse(((String) mitJS.get("endDate"))));
					step.setProjectID(Long.parseLong(stringMap.get("PROJECTID")));
					step.setStepDescription((String)mitJS.get("description"));
					step.setRiskID(riskID);

					if ((Boolean)(objMap.get("RESPONSE"))){
						step.setResponse(true);
					}

					sess.save(step);
					tx.commit();
				} else {
					Transaction tx = sess.beginTransaction();
					ModelMitigationStep step = (ModelMitigationStep)sess.get(ModelMitigationStep.class, mitID);
					step.setEstimatedCost(getDoubleJS(mitJS.get("estCost")));
					step.setPercentComplete(getDoubleJS(mitJS.get("estCost")));
					step.setEndDate(df.parse(((String) mitJS.get("endDate"))));
					step.setStepDescription((String)mitJS.get("description"));

					sess.update(step);
					tx.commit();
				}
			} catch (Exception e) {
				e.printStackTrace();
			}


		} else {
			Transaction tx = sess.beginTransaction();
			ModelMitigationStep step = new ModelMitigationStep();
			step.setResponse(false);
			step.personID = userID;
			step.setEstimatedCost(0.0);
			step.setPercentComplete(0.0);
			step.setEndDate(new Date());
			step.setProjectID(Long.parseLong(stringMap.get("PROJECTID")));
			step.setStepDescription("Enter details of Mitigation Action");
			step.setRiskID(Long.parseLong(stringMap.get("RISKID")));

			if ((Boolean)(objMap.get("RESPONSE"))){
				step.setResponse(true);
				step.setStepDescription("Enter details of Response Action");
			}

			sess.save(step);
			tx.commit();
		}

		outputJSON(getRisk(riskID, userID,projectID, sess),response);
		notifyUpdate(Long.parseLong(stringMap.get("RISKID")),request);


	}
}
