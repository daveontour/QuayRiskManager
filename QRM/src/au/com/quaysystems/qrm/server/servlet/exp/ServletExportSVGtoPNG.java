package au.com.quaysystems.qrm.server.servlet.exp;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.batik.transcoder.TranscoderInput;
import org.apache.batik.transcoder.TranscoderOutput;
import org.apache.batik.transcoder.image.PNGTranscoder;

@WebServlet (value = "/exportSVGtoPNG", asyncSupported = false)
public class ServletExportSVGtoPNG extends HttpServlet {

	/** The Constant serialVersionUID. */
	private static final long serialVersionUID = 1387308835754413189L;


	public final void doPost(final HttpServletRequest request, final HttpServletResponse response) throws ServletException {
		
		
        try {
       	
        	ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(request.getParameter("svg").getBytes());
			TranscoderInput input_svg_image = new TranscoderInput(byteArrayInputStream); 
			
			ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

			TranscoderOutput output_png_image = new TranscoderOutput(byteArrayOutputStream); 
			
			// Step-3: Create PNGTranscoder and define hints if required
			PNGTranscoder my_converter = new PNGTranscoder(); 
			
			// Step-4: Convert and Write output
			my_converter.transcode(input_svg_image, output_png_image);
			
			response.setHeader("Content-Disposition", "attachment; filename=chart");
			response.setHeader("Content-Length", new Integer(byteArrayOutputStream.size()).toString());
			
			byteArrayOutputStream.writeTo(response.getOutputStream());
			
			response.getOutputStream().flush();
			response.getOutputStream().close();
		} catch (Exception e) {
			e.printStackTrace();
		} 
	}

}
