package au.com.quaysystems.qrm.dto;

import java.util.ArrayList;

import org.apache.commons.beanutils.PropertyUtils;

@SuppressWarnings("serial")
public class DTORiskTree extends ModelRisk{

	public long parentSummaryRisk;
	public long origParentSummaryRisk;
	public long tempIndex;
	public long relationshipID;
	public boolean expanded = true;
	public boolean leaf = true;
	public ArrayList<DTORiskTree> risks = new ArrayList<>();
	

	public DTORiskTree addParent(ModelRiskLite riskParent) {
		DTORiskTree item = new DTORiskTree();

		try {
			PropertyUtils.copyProperties(item, riskParent);
		} catch (Exception e) {
			e.printStackTrace();
		} 
		item.riskID = riskParent.riskID;
		try {
			item.tempIndex = riskParent.tempIndex;
		} catch (Exception e) {
			// TODO Auto-generated catch block
//			e.printStackTrace();
		}
		
		item.leaf = false;
		
		risks.add(item);
		System.out.println("Parent: RiskID: "+item.riskID);
		return item;
	}
	public void add(ModelRiskLiteRelationship childRisk) {
		DTORiskTree item = new DTORiskTree();
		
		try {
			PropertyUtils.copyProperties(item, childRisk);
		} catch (Exception e) {
			e.printStackTrace();
		} 
		
		item.riskID = childRisk.riskID;
		item.relationshipID = childRisk.relationshipID;

		item.parentSummaryRisk = childRisk.parentSummaryRisk;
		item.origParentSummaryRisk = childRisk.origParentSummaryRisk;
		item.tempIndex = childRisk.tempIndex;

		System.out.println("Child: RiskID: "+item.riskID+"  RelationshipID: "+item.relationshipID);

		risks.add(item);		
	}
}
