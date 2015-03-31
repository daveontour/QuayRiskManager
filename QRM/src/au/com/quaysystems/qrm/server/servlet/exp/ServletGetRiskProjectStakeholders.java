package au.com.quaysystems.qrm.server.servlet.exp;

import java.util.HashMap;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hibernate.Session;

import au.com.quaysystems.qrm.dto.ModelPerson;

@SuppressWarnings("serial")
@WebServlet (value = "/getRiskProjectStakeholders", asyncSupported = false)
public class ServletGetRiskProjectStakeholders extends QRMRPCServlet {

	@Override
	void execute(HttpServletRequest request, HttpServletResponse response,
			Session sess, Long userID, HashMap<String, String> stringMap,
			HashMap<Object, Object> objMap, Long projectID, Long riskID) {


		xsJSON.omitField(ModelPerson.class, "active");
		xsJSON.omitField(ModelPerson.class, "allowUserMgmt");
		xsJSON.omitField(ModelPerson.class, "allowlogon");
		xsJSON.omitField(ModelPerson.class, "email");
		xsJSON.omitField(ModelPerson.class, "lastLogon");
		xsJSON.omitField(ModelPerson.class, "emailmsgtypes");
		xsJSON.omitField(ModelPerson.class, "riskmanager");
		xsJSON.omitField(ModelPerson.class, "riskowner");
		
		System.out.println(request.getRequestURL());
		xsXML.toXML(stringMap, System.out);
//		System.out.println(xsJSON.toXML(getProjectRiskManagers( projectID, sess)));

		try {
			response.getWriter().println(xsJSON.toXML(getProjectRiskManagers( projectID, sess)));
		} catch (Exception e) {
			e.printStackTrace();
			outputJSON(false,response);
		}
	}

}
