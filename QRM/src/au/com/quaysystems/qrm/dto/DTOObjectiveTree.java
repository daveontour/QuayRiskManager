package au.com.quaysystems.qrm.dto;

import java.util.ArrayList;

public class DTOObjectiveTree {
	public String objective;
	public Long projectID;
	public Long parentID;
	public boolean expanded = true;
	public boolean leaf = true;
	public Long objectiveID;
	public ArrayList<DTOObjectiveTree> objectives = new ArrayList<>();
	
	public DTOObjectiveTree add(ModelObjective objective) {
		DTOObjectiveTree item = new DTOObjectiveTree();
		item.projectID = objective.projectID;
		item.parentID = objective.parentID;
		item.objective = objective.objective;
		item.objectiveID = objective.objectiveID;
		objectives.add(item);
		return item;
	}
}
