package au.com.quaysystems.qrm.server.servlet.exp;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hibernate.Session;

import au.com.quaysystems.qrm.QRMConstants;
import au.com.quaysystems.qrm.dto.AllocationRiskDTO;
import au.com.quaysystems.qrm.dto.AnalysisDTO;
import au.com.quaysystems.qrm.dto.DTOSearchParam;
import au.com.quaysystems.qrm.dto.AllocationDTO;
import au.com.quaysystems.qrm.dto.ModelRiskLiteExt;

@SuppressWarnings("serial")
@WebServlet (value = "/getAllStats", asyncSupported = false)
public class ServletGetAllStats extends QRMRPCServlet {

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	void execute(HttpServletRequest request, HttpServletResponse response,
			Session sess, Long userID, HashMap<String, String> stringMap,
			HashMap<Object, Object> objMap, Long projectID, Long riskID) {

		DTOSearchParam searchParam = SearchStringHelper.getAllSearch(stringMap, objMap, projectID, riskID,userID);
		List<ModelRiskLiteExt> risks = sess.createSQLQuery(SearchStringHelper.getSQLSearchString(searchParam)).addEntity(ModelRiskLiteExt.class).list();
		Connection conn = getSessionConnection(request);

		String listOfProjects = projectID.toString();

		if(Boolean.parseBoolean(stringMap.get("DESCENDANTS"))){
			try {
				ResultSet rsTemp = conn.createStatement().executeQuery("SELECT subprojectID FROM subprojects WHERE projectID = "+ projectID);
				while (rsTemp.next()) {
					Long pid = rsTemp.getLong(1);
					if (pid != -1) {
						listOfProjects = listOfProjects + "," + pid;
					}
				}
			} catch (SQLException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
		}

		HashMap<String, HashMap<Integer, Integer>> managerMap = new HashMap<>();
		HashMap<String, HashMap<Integer, Integer>> ownerMap = new HashMap<>();
		HashMap<String, HashMap<Integer, Integer>> catMap = new HashMap<>();
		HashMap<String, HashMap<Integer, Integer>> statusMap = new HashMap<>();
		HashMap<String, AllocationRiskDTO> riskMap = new HashMap<>();

		for (ModelRiskLiteExt risk: risks){

			//Manager allocation
			HashMap<Integer, Integer> mgrAllocation = managerMap.get(risk.manager1Name);
			if (mgrAllocation == null){
				mgrAllocation = new HashMap<Integer,Integer>();
				mgrAllocation.put(99, risk.manager1ID.intValue());
				managerMap.put(risk.manager1Name, mgrAllocation);
			}
			mgrAllocation.put(risk.currentTolerance, (mgrAllocation.get(risk.currentTolerance)== null)?1:mgrAllocation.get(risk.currentTolerance)+1 );

			// Owner allocation

			HashMap<Integer, Integer> ownAllocation = ownerMap.get(risk.ownerName);
			if (ownAllocation == null){
				ownAllocation = new HashMap<Integer,Integer>();
				ownAllocation.put(99, risk.ownerID.intValue());
				ownerMap.put(risk.ownerName, ownAllocation);
			}
			ownAllocation.put(risk.currentTolerance, (ownAllocation.get(risk.currentTolerance)== null)?1:ownAllocation.get(risk.currentTolerance)+1 );

			// Category Allocation
			if (risk.primCatName == null){
				risk.primCatName = "No Category";
				risk.primCatID = -1L;
			}
			HashMap<Integer, Integer> catAllocation = catMap.get(risk.primCatName);
			if (catAllocation == null){
				catAllocation = new HashMap<Integer,Integer>();
				catAllocation.put(99, risk.primCatID.intValue());
				catMap.put(risk.primCatName, catAllocation);
			}
			catAllocation.put(risk.currentTolerance, (catAllocation.get(risk.currentTolerance)== null)?1:catAllocation.get(risk.currentTolerance)+1 );
			riskMap.put(risk.riskProjectCode, new AllocationRiskDTO(risk.riskProjectCode, (risk.mitigationCost != null)?risk.mitigationCost:0, risk.estimatedContingencey, new Date(risk.startExposure.getTime()), new Date(risk.endExposure.getTime())));
		}

		setControlMeasures(listOfProjects, conn, riskMap);
		setMitigationSteps(listOfProjects, conn, riskMap);
		setUpdateDays(listOfProjects, conn, riskMap);
		setStatusAllocation(listOfProjects, conn, statusMap);
		
		try {
			conn.close();
		} catch (SQLException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}

		ArrayList<AnalysisDTO> data = new ArrayList<>();
		data.add(new AnalysisDTO("Risk Manager Allocation", getEntries(managerMap), "Risk Manager Allocation", "Risk Manager", "Number of Risks", false, false, true, false, "managerFind(me.storeItem.data.id, me.yField)"));
		data.add(new AnalysisDTO("Risk Owner Allocation", getEntries(ownerMap), "Risk Owner Allocation", "Risk Owner", "Number of Risks", false, false, true, false, "ownerFind(me.storeItem.data.id,  me.yField)"));
		data.add(new AnalysisDTO("Category Allocation", getEntries(catMap), "Category Allocation", "Primary Category", "Number of Risks", false, false, true, false, "categoryFind(me.storeItem.data.id,  me.yField)"));
		data.add(new AnalysisDTO("Status Allocation", getEntries(statusMap), "Status Allocation", "Status", "Number of Risks", false, false, true, false, "statusFind(me.storeItem.data.name,  me.yField)"));

		AnalysisDTO entry = new AnalysisDTO("Contingency Cost", new ArrayList(riskMap.values()), "Contingency Cost", "Risk", "Contingency Costs", true, true, true, false, "getRiskCodeAndDisplayInt(me.storeItem.data.name)");
		entry.hasRiskData = true;
		entry.riskChart = true;
		entry.toleranceChart = false;
		entry.riskField = "contingencyCost";

		AnalysisDTO entry2 = new AnalysisDTO("Mitigation Cost", null, "Mitigation Cost", "Risk", "Mitigation Costs", true, true, true, false, "getRiskCodeAndDisplayInt(me.storeItem.data.name)");
		entry2.hasRiskData = false;
		entry2.riskChart = true;
		entry2.toleranceChart = false;
		entry2.riskField = "mitigationCost";

		AnalysisDTO entry3 = new AnalysisDTO("Mitigation Steps", null, "Mitigation Steps", "Risk", "Number of Mitigation Steps", true, true, true, false, "getRiskCodeAndDisplayInt(me.storeItem.data.name)");
		entry3.hasRiskData = false;
		entry3.riskChart = true;
		entry3.toleranceChart = false;
		entry3.riskField = "mitigationSteps";

		AnalysisDTO entry4 = new AnalysisDTO("Risk Controls", null, "Risk Controls", "Risk", "Number of Risk Controls", true, true, true, false, "getRiskCodeAndDisplayInt(me.storeItem.data.name)");
		entry4.hasRiskData = false;
		entry4.riskChart = true;
		entry4.toleranceChart = false;
		entry4.riskField = "riskControls";

		AnalysisDTO entry5 = new AnalysisDTO("Days Since Last Update", null, "Days", "Risk", "Number of Days Since Last Update", true, true, true, false, "getRiskCodeAndDisplayInt(me.storeItem.data.name)");
		entry5.hasRiskData = false;
		entry5.riskChart = true;
		entry5.toleranceChart = false;
		entry5.riskField = "numDays";

		data.add(entry);
		data.add(entry2);
		data.add(entry3);
		data.add(entry4);
		data.add(entry5);


		try {
			xsJSON.toXML(data, response.getOutputStream());
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public ArrayList<Object> getEntries(HashMap<String, HashMap<Integer, Integer>> map){

		ArrayList<Object> list = new ArrayList<Object>();
		for (String key : map.keySet() ){
			HashMap<Integer, Integer> item = map.get(key);
			AllocationDTO entry = new AllocationDTO();
			entry.id = item.get(99);
			entry.name = key; 
			entry.Extreme = (item.get(5) == null)?0:item.get(5);
			entry.High =  (item.get(4) == null)?0:item.get(4);
			entry.Significant =  (item.get(3) == null)?0:item.get(3);
			entry.Moderate =  (item.get(2) == null)?0:item.get(2);
			entry.Low =  (item.get(1) == null)?0:item.get(1);

			list.add(entry);
		}

		return (ArrayList<Object>)list;
	}

	public void setControlMeasures(String listOfProjects, Connection conn,HashMap<String, AllocationRiskDTO> riskMap){

		try {
			Statement statement = conn.createStatement();
			ResultSet rs1 = statement.executeQuery("SELECT COUNT(*) AS CNT, risk.riskProjectCode FROM riskcontrols, risk  WHERE risk.riskID = riskcontrols.riskID AND risk.projectID IN ("
					+ listOfProjects
					+ ") GROUP BY riskcontrols.riskID, risk.riskProjectCode ORDER BY CNT DESC");

			while (rs1.next()) {
				String riskCode = rs1.getString("riskProjectCode");
				Integer count = rs1.getInt("CNT");

				AllocationRiskDTO entry = riskMap.get(riskCode);
				entry.riskControls = count;

			}
		} catch (Exception e) {
			log.error("QRM Stack Trace", e);
		}

	}

	public void setMitigationSteps(String listOfProjects, Connection conn,HashMap<String, AllocationRiskDTO> riskMap){

		try {
			Statement statement = conn.createStatement();
			ResultSet rs1 = statement.executeQuery("SELECT COUNT(*) AS CNT, risk.riskProjectCode FROM mitigationstep, risk  WHERE risk.riskID = mitigationstep.riskID AND risk.projectID IN ("
					+ listOfProjects
					+ ") GROUP BY mitigationstep.riskID, risk.riskProjectCode ORDER BY CNT DESC");

			while (rs1.next()) {
				String riskCode = rs1.getString("riskProjectCode");
				Integer count = rs1.getInt("CNT");

				AllocationRiskDTO entry = riskMap.get(riskCode);
				entry.mitigationSteps = count;

			}
		} catch (Exception e) {
			log.error("QRM Stack Trace", e);
		}

	}
	
	public void setUpdateDays(String listOfProjects, Connection conn,HashMap<String, AllocationRiskDTO> riskMap){

		try {
			Statement statement = conn.createStatement();
			ResultSet rs1 = statement.executeQuery("SELECT risk.timeUpdated, risk.riskProjectCode FROM risk WHERE risk.projectID IN ("
					+ listOfProjects
					+ ") ORDER BY timeUpdated ASC");

			long now = new java.util.Date().getTime();

			while (rs1.next()) {
				String riskCode = rs1.getString(2);
				
				double numDays = (double) (now - rs1.getTimestamp(1).getTime())	/ (double) (1000L * 60L * 60L * 24L);


				AllocationRiskDTO entry = riskMap.get(riskCode);
				entry.numDays = numDays;

			}
		} catch (Exception e) {
			log.error("QRM Stack Trace", e);
		}

	}
	
	public void setStatusAllocation(String listOfProjects, Connection conn,HashMap<String, HashMap<Integer, Integer>> statusMap){
		try {

//			HashMap<String,HashMap<Integer, Double>> map = new HashMap<String,HashMap<Integer, Double>>();

			statusMap.put("Inactive", new HashMap<Integer,Integer>());
			statusMap.put("Active", new HashMap<Integer,Integer>());
			statusMap.put("Pending", new HashMap<Integer,Integer>());

			String sql =
				" 	SELECT COUNT(*), currentTolerance, \"Pending\" AS status from risk where startExposure > current_date  AND projectID IN ("+ listOfProjects + ") GROUP BY currentTolerance" +
				" 	UNION" +
				" 	SELECT COUNT(*), currentTolerance, \"Inactive\" AS status from risk where endExposure < current_date  AND projectID IN ("+ listOfProjects + ") GROUP BY currentTolerance" +
				" 	UNION " +
				" 	SELECT COUNT(*), currentTolerance, \"Active\" AS status from risk where startExposure <= current_date AND endExposure >= current_date  AND projectID IN ("+ listOfProjects + ") GROUP BY currentTolerance";

			ResultSet rs = conn.createStatement().executeQuery(sql);

			while (rs.next()){
				statusMap.get(rs.getString("status")).put(rs.getInt("currentTolerance"), rs.getInt("COUNT(*)"));
			}


		} catch (Exception e) {
			log.error("QRM Stack Trace", e);
		} 
	}
}
