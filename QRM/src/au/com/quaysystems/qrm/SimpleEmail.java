package au.com.quaysystems.qrm;
import java.util.Properties;
 
import javax.mail.Session;
 
public class SimpleEmail {
     
    public static void main(String[] args) {
         
        System.out.println("SimpleEmail Start");
         
        String smtpHostServer = "qrm.quaysystems.com.au";
        String emailID = "dave_on_tour@yahoo.com";
         
        Properties props = System.getProperties();
 
        props.put("mail.smtp.host", smtpHostServer);
 
        Session session = Session.getInstance(props, null);
         
        EmailUtil.sendEmail(session, emailID,"SimpleEmail Testing Subject", "SimpleEmail Testing Body");
    }
 
}