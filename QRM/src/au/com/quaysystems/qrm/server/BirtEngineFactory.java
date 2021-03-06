package au.com.quaysystems.qrm.server;

import java.util.Properties;
import java.util.logging.Level;

import org.eclipse.birt.core.framework.Platform;
import org.eclipse.birt.report.engine.api.EmitterInfo;
import org.eclipse.birt.report.engine.api.EngineConfig;
import org.eclipse.birt.report.engine.api.IReportEngine;
import org.eclipse.birt.report.engine.api.IReportEngineFactory;

public class BirtEngineFactory {

	private static IReportEngine engine = null;
	private static Properties configProp;

	private BirtEngineFactory() {
		// Exists only to defeat instantiation.
	}

	public static IReportEngine getInstance() {
		if(engine == null) {
			
			try{
				
				final EngineConfig config = new EngineConfig( );

				config.setResourcePath(configProp.getProperty("REPORT_PATH").replace("\\", "/"));
				
				Platform.startup(config);
				
				System.out.println("Report Platform Started");
				
				IReportEngineFactory factory = (IReportEngineFactory) Platform.createFactoryObject( IReportEngineFactory.EXTENSION_REPORT_ENGINE_FACTORY );
				engine = factory.createReportEngine( config );
				engine.changeLogLevel( Level.WARNING );
				System.out.println("Report Engine Started");

			} catch ( Exception ex){
				ex.printStackTrace();
			}
		}
		
		EmitterInfo[] emitterInfos = engine.getEmitterInfo( );
		for ( int i = 0; i < emitterInfos.length; i++ )	{
			EmitterInfo emitterInfo = emitterInfos[i];
			System.out.println("Emitter ID "+emitterInfo.getID( )+"  "+emitterInfo.getFormat()+"  "+emitterInfo.getFormat()+"  "+emitterInfo.getMimeType());
		}

		return engine;
	}

	public static void resetEngine(){
		try {
			engine = null;
			Platform.shutdown();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	public static IReportEngine getInstance(Properties props) {
		configProp = props;
		return getInstance();
	}

}
