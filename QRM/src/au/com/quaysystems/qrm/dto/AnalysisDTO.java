package au.com.quaysystems.qrm.dto;

import java.util.ArrayList;

public class AnalysisDTO {
	public String name;
	public String title;
	public String yaxisTitle;
	public String xaxisTitle;
	public boolean reversible;
	public boolean selectNumber;
	public boolean toleranceEncoding;
	public boolean selectTolerance;
	public String clickFunction;
	public boolean hasRiskData = false;
	public boolean riskChart = false;
	public boolean toleranceChart = true;
	public String riskField;
	public ArrayList<Object> data;
	public AnalysisDTO(String name, ArrayList<Object> data,
			String title, String yaxisTitle, String xaxisTitle,
			boolean reversible, boolean selectNumber, boolean toleranceEncoding, boolean selectTolerance, String clickFunction) {
		this.name = name;
		this.data = data;
		this.title = title;
		this.yaxisTitle = yaxisTitle;
		this.xaxisTitle = xaxisTitle;
		this.reversible = reversible;
		this.selectNumber = selectNumber;
		this.toleranceEncoding = toleranceEncoding;
		this.selectTolerance = selectTolerance;
		this.clickFunction = clickFunction;
	}
}