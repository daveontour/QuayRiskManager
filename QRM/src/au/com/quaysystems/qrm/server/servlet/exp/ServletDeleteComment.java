package au.com.quaysystems.qrm.server.servlet.exp;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.HashMap;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hibernate.Session;
import org.hibernate.Transaction;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import au.com.quaysystems.qrm.dto.ModelAuditComment;
import au.com.quaysystems.qrm.dto.ModelUpdateComment;
import au.com.quaysystems.qrm.server.PersistenceUtil;

@SuppressWarnings("serial")
@WebServlet (value = "/deleteComment", asyncSupported = false)
public class ServletDeleteComment extends QRMRPCServlet {

	@Override
	void execute(HttpServletRequest request, HttpServletResponse response,
			Session sess, Long userID, HashMap<String, String> stringMap,
			HashMap<Object, Object> objMap, Long projectID, Long riskID) {
		
		boolean securityViolation = false;
		
		try {
			
			Transaction tx = sess.beginTransaction();
			
			for (Object obj : (JSONArray) parser.parse(stringMap.get("COMMENTS"))) {
				JSONObject jObj = (JSONObject)obj;
				Long objID = getLongJS(jObj.get("internalID"));
				
				ModelAuditComment comment = (ModelAuditComment) sess.get(ModelAuditComment.class, objID );
				
				// Not this user
				if (comment.enteredByID.longValue() != userID.longValue()){
					securityViolation = true;
					continue;
				}
				
				// Some comments can't be deleted
				if (comment.evaluation || comment.identification || comment.mitigation || comment.review){
					securityViolation = true;
					continue;
				}
				
				sess.delete(comment);

			}
			
			tx.commit();

			this.outputJSON(securityViolation, response);

		} catch (Exception e) {
			log.error("QRM Stack Trace", e);
		}
	}
}
