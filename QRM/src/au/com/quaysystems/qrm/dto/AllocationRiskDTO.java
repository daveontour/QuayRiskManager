package au.com.quaysystems.qrm.dto;

import java.util.Date;

public class AllocationRiskDTO {
	public String name;
	public Double mitigationCost = 0.0;
	public Integer mitigationSteps = 0;
	public Integer numControls = 0;
	public Integer daysLastUpdate = 0;
	public Double contingencyCost = 0.0;
	public Date startDate;
	public Date endDate;
	public Integer riskControls = 0;
	public double numDays;
	
	public AllocationRiskDTO(String name, Double mitigationCost,
			Double contingenceyCost, Date startExposure, Date endExposure) {
		
		this.name = name;
		this.mitigationCost = mitigationCost;
		this.contingencyCost = contingenceyCost;
		this.startDate = startExposure;
		this.endDate = endExposure;
		
	}

}