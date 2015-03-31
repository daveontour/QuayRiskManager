package au.com.quaysystems.qrm.server.servlet.exp;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hibernate.Session;

import au.com.quaysystems.qrm.dto.ModelUpdateComment;

@SuppressWarnings("serial")
@WebServlet (value = "/getMitUpdateComment", asyncSupported = false)
public class ServletGetMitUpdateComment extends QRMRPCServlet {

	@SuppressWarnings("unchecked")
	@Override
	void execute(HttpServletRequest request, HttpServletResponse response,
			Session sess, Long userID, HashMap<String, String> stringMap,
			HashMap<Object, Object> objMap, Long projectID, Long riskID) {

		ArrayList<ModelUpdateComment> mitStepUpdates = new ArrayList<>();

		try {

			long mitstepID = Long.parseLong(stringMap.get("MITSTEPID"));

			try {
				List<ModelUpdateComment> updates = (List<ModelUpdateComment>)sess.getNamedQuery("getRiskMitigationStepsUpdate").setLong("riskID", riskID).list();
				for(ModelUpdateComment comment:updates){
					if (comment.hostType.indexOf("MITIGATION") == -1 || comment.hostID.longValue() != mitstepID) {
						continue;
					}
					mitStepUpdates.add(comment);
				}

			} catch (RuntimeException e) {
				log.error("QRM Stack Trace", e);
			}
			outputJSON(mitStepUpdates,response);
		} catch (Exception e) {
			try {
				response.setStatus(405);
				response.getWriter().println("Error retrieving risk");
				return;
			} catch (IOException e1) {
				log.error("QRM Stack Trace", e1);
			}
		}
	}
}
