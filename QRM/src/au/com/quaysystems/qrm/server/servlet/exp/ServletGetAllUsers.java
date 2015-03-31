package au.com.quaysystems.qrm.server.servlet.exp;

import java.util.HashMap;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hibernate.Session;

import au.com.quaysystems.qrm.dto.ModelPerson;

@SuppressWarnings("serial")
@WebServlet (value = "/getAllUsers", asyncSupported = false)
public class ServletGetAllUsers extends QRMRPCServlet {

	@Override
	void execute(HttpServletRequest request, HttpServletResponse response,
			Session sess, Long userID, HashMap<String, String> stringMap,
			HashMap<Object, Object> objMap, Long projectID, Long riskID) {
		
		try {
			outputJSON(sess.createCriteria(ModelPerson.class).list(), response);
		} catch (Exception e) {
			log.error("QRM Stack Trace", e);
		} 
	}	
}
