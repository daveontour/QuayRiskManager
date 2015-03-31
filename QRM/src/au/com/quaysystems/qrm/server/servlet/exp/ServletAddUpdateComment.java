package au.com.quaysystems.qrm.server.servlet.exp;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.HashMap;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hibernate.Session;

import au.com.quaysystems.qrm.dto.ModelAuditComment;
import au.com.quaysystems.qrm.server.PersistenceUtil;

@SuppressWarnings("serial")
@WebServlet (value = "/addUpdateComment", asyncSupported = false)
public class ServletAddUpdateComment extends QRMRPCServlet {

	@Override
	void execute(HttpServletRequest request, HttpServletResponse response,
			Session sess, Long userID, HashMap<String, String> stringMap,
			HashMap<Object, Object> objMap, Long projectID, Long riskID) {
		
		try {
			
			Long id = Long.parseLong(stringMap.get("COMMENTID"));

			if (id < 0){
				Connection conn = PersistenceUtil.getConnection((String) request.getSession().getAttribute("session.url"));
				conn.setAutoCommit(false);

				String sql = null;
				PreparedStatement stmt = null;

				sql = "INSERT INTO auditcomments (  riskID, enteredByID, comment) VALUES (?,?,?)";
				stmt = conn.prepareStatement(sql);
				stmt.setLong(1, riskID);
				stmt.setLong(2, userID);
				stmt.setString(3, stringMap.get("COMMENT"));
				stmt.execute();

				conn.commit();
				conn.close();
			} else {
				Connection conn = PersistenceUtil.getConnection((String) request.getSession().getAttribute("session.url"));
				conn.setAutoCommit(false);

				String sql = null;
				PreparedStatement stmt = null;

				sql = "UPDATE auditcomments SET comment = ? WHERE internalID = ?";
				stmt = conn.prepareStatement(sql);
				stmt.setString(1, stringMap.get("COMMENT"));
				stmt.setLong(2, id);
				stmt.execute();

				conn.commit();
				conn.close();			}

		} catch (Exception e) {
			log.error("QRM Stack Trace", e);
		}
	}
}
