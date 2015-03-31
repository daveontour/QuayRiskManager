package au.com.quaysystems.qrm.server.servlet.exp;

import java.util.HashMap;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hibernate.Session;
import org.json.simple.JSONArray;

import au.com.quaysystems.qrm.dto.ModelRiskConsequence;

@SuppressWarnings("serial")
@WebServlet (value = "/deleteConsequences", asyncSupported = false)
public class ServletDeleteConsequences extends QRMRPCServlet {

	@Override
	void execute(HttpServletRequest request, HttpServletResponse response,
			Session sess, Long userID, HashMap<String, String> stringMap,
			HashMap<Object, Object> objMap, Long projectID, Long riskID) {
		
		if (stringMap.containsKey("EXT")){
			
			try {
				JSONArray arr = (JSONArray)parser.parse(request.getParameter("ID"));
				for (Object jID:arr){
					Long id = this.getLongJS(jID);
					sess.beginTransaction();
					sess.delete((ModelRiskConsequence) sess.get(ModelRiskConsequence.class,id));
					sess.getTransaction().commit();			
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
			
		} else {
			sess.beginTransaction();
			sess.delete((ModelRiskConsequence) sess.get(ModelRiskConsequence.class,Long.parseLong(request.getParameter("ID"))));
			sess.getTransaction().commit();						
		}
		outputJSON(getRiskConsequences(riskID, sess),response);
	}
}
