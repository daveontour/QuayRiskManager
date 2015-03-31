package au.com.quaysystems.qrm.server.servlet.exp;

import java.util.HashMap;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hibernate.Session;
import org.hibernate.Transaction;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;

import au.com.quaysystems.qrm.dto.ModelRiskControl;

@SuppressWarnings("serial")
@WebServlet (value = "/saveRiskControls", asyncSupported = false)
public class ServletSaveRiskControls extends QRMRPCServlet {

	@Override
	void execute(HttpServletRequest request, HttpServletResponse response,
			Session sess, Long userID, HashMap<String, String> stringMap,
			HashMap<Object, Object> objMap, Long projectID, Long riskID) {


		// Check if the user has update rights to the risk.
		if (!checkUpdateSecurity(riskID, userID, request)) {
			outputJSON(getRisk(riskID, userID, projectID, sess),response);
			return;
		}
		
		if (objMap.containsKey("EXT")){
			try {
				JSONObject controlJS = (JSONObject)parser.parse(stringMap.get("CONTROL"));
				Long id = this.getLongJS(controlJS.get("internalID"));
				if (id < 0){
					
					Transaction tx = sess.beginTransaction();
					ModelRiskControl control = new ModelRiskControl();
					control.setControl((String) controlJS.get("control"));
					control.setRiskID(riskID);
					try {
						control.setEffectiveness(((Long) controlJS.get("effectiveness")).intValue());
					} catch (ClassCastException e) {
						control.setEffectiveness(((Long) Long.parseLong((String) controlJS.get("effectiveness"))).intValue());
					} catch (Exception e) {
						control.setEffectiveness(1);
					}
					control.setContribution((String) controlJS.get("contribution"));
					sess.save(control);
					
					tx.commit();
				} else {
					// Old comment to update
					Transaction tx = sess.beginTransaction();
					
					ModelRiskControl control = (ModelRiskControl)sess.get(ModelRiskControl.class, id);
					control.setControl((String) controlJS.get("control"));
					try {
						control.setEffectiveness(((Long) controlJS.get("effectiveness")).intValue());
					} catch (ClassCastException e) {
						control.setEffectiveness(((Long) Long.parseLong((String) controlJS.get("effectiveness"))).intValue());
					} catch (Exception e) {
						control.setEffectiveness(1);
					}
					control.setContribution((String) controlJS.get("contribution"));
					
					sess.update(control);

					tx.commit();
				}
			} catch (Exception e) {
				e.printStackTrace();
			}

		} else {

			try {
				JSONArray controlsJS = (JSONArray) parser.parse(stringMap.get("DATA"));

				for (Object obj : controlsJS) {
					Transaction tx = sess.beginTransaction();
					JSONObject ctr = (JSONObject) obj;
					ModelRiskControl control = new ModelRiskControl();
					control.setControl((String) ctr.get("control"));
					control.setRiskID(Long.parseLong(stringMap.get("RISKID")));
					control.setInternalID((Long) ctr.get("internalID"));
					try {
						control.setEffectiveness(((Long) ctr.get("effectiveness")).intValue());
					} catch (ClassCastException e) {
						control.setEffectiveness(((Long) Long.parseLong((String) ctr.get("effectiveness"))).intValue());
					} catch (Exception e) {
						control.setEffectiveness(1);
					}
					control.setContribution((String) ctr.get("contribution"));
					sess.update(control);
					tx.commit();
					sess.clear();
				}
			} catch (Exception e1) {
				outputJSON(false,response);
			}
		}

		outputJSON(getRisk(riskID, userID,	projectID, sess),response);
		notifyUpdate(Long.parseLong(stringMap.get("RISKID")), request);

	}
}
