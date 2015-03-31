package au.com.quaysystems.qrm.server.servlet.exp;

import java.util.HashMap;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hibernate.CacheMode;
import org.hibernate.FlushMode;
import org.hibernate.Session;

import au.com.quaysystems.qrm.dto.ModelRepository;
import au.com.quaysystems.qrm.server.PersistenceUtil;

@SuppressWarnings("serial")
@WebServlet (value = "/getUserCoreRepositoryInfo", asyncSupported = false)
public class ServletGetUserCoreRepositoryInfo extends QRMRPCServlet {

	@Override
	void execute(HttpServletRequest request, HttpServletResponse response,
			Session sess, Long userID, HashMap<String, String> stringMap,
			HashMap<Object, Object> objMap, Long projectID, Long riskID) {

		Session sess2 = PersistenceUtil.getSimpleControlSession();
		sess2.setCacheMode(CacheMode.IGNORE);
		sess2.setFlushMode(FlushMode.ALWAYS);

		try {
			Object[] arr = new Object[7];
			arr[0] = sess.getNamedQuery("getAllRepPersonLite").list();
			arr[1] = sess.getNamedQuery("getAllMatrix").list();
			arr[2] = sess.getNamedQuery("getAllCategorys").list();
			arr[3] = sess.getNamedQuery("getAllObjectives").list();
			arr[4] = sess.getNamedQuery("getAllQuantTypes").list();
			arr[5] = getPerson(userID, sess);
			arr[6] = ((ModelRepository)(sess2.get(ModelRepository.class, getRepositoryID((String)request.getSession().getAttribute("session.url"))))).repLogonMessage;

			outputJSON2B(arr,response);
		} catch (Exception e) {
			log.error("QRM Stack Trace", e);
		} finally {
			sess2.close();
		}
	}
}
