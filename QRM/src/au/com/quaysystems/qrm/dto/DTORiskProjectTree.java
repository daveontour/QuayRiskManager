package au.com.quaysystems.qrm.dto;

import java.util.ArrayList;

public class DTORiskProjectTree {
	public String projectTitle;
	public String displayTitle;
	public Long projectID;
	public Long parentID;
	public boolean expanded = true;
	public boolean leaf = true;
	public ArrayList<DTORiskProjectTree> projects = new ArrayList<>();
	
	public DTORiskProjectTree add(ModelRiskProject project) {
		DTORiskProjectTree item = new DTORiskProjectTree();
		item.projectTitle = project.getProjectTitle();
		item.projectID = project.projectID;
		item.parentID = project.parentID;
		item.displayTitle = project.projectTitle+" ("+project.projectCode+")";
		projects.add(item);
		return item;
	}
}
