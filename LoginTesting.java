package pineapplemusictesting;

import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.html.HtmlForm;
import com.gargoylesoftware.htmlunit.html.HtmlPage;
import com.gargoylesoftware.htmlunit.html.HtmlPasswordInput;
import com.gargoylesoftware.htmlunit.html.HtmlSubmitInput;
import com.gargoylesoftware.htmlunit.html.HtmlTextInput;

public class LoginTesting {
	
	public static void main(String[] args) throws Exception {
		
		// createAccount("abc","abc","abc","bunzssbm@gmail.com");
		searchSong("yeet");
	}
	
		static public void createAccount(String username, String password, String verifyPassword, String email) throws Exception {
	    try { WebClient webClient = new WebClient();
	    //Retrieves login page
		    final HtmlPage pageLogin = webClient.getPage("http://localhost:3000/loadCreateAccount/");
		//Prints title of page to ensure correct page is loaded
		    System.out.println(pageLogin.getTitleText() + "\n");
		    
		//Retrieves all input fields in the form and assigns them to variables
		    final HtmlForm formLogin = pageLogin.getFormByName(""); //the name is blank for form and SubmitInput
		    final HtmlSubmitInput button = formLogin.getInputByName("");
		    final HtmlTextInput userNameText = formLogin.getInputByName("username");
		    final HtmlTextInput emailText = formLogin.getInputByName("email");
		    final HtmlPasswordInput passwordText = formLogin.getInputByName("password");
		    final HtmlPasswordInput passwordText2 = formLogin.getInputByName("verifyPassword");
		    
		//Assigns each parameter to its respective field variable
		    userNameText.type(username);
		    emailText.type(email);
		    passwordText.type(password);
		    passwordText2.type(verifyPassword);
		    
	    //Submits form and loads the next page
		    final HtmlPage page2 = button.click();
		    
		   webClient.close();
	    }finally{
	    	
	    }
	    
	}


static public void searchSong(String songname) throws Exception {
			try { WebClient webClient = new WebClient();
		    //Retrieves login page
			    final HtmlPage pageLogin = webClient.getPage("file:///C:/Users/drees/Documents/PineappleMusic/homePage.html");
			//Prints title of page to ensure correct page is loaded
			    System.out.println(pageLogin.getTitleText() + "\n");
			    
			//Retrieves all input fields in the form and assigns them to variables
			    final HtmlForm formLogin = pageLogin.getFormByName("search"); 
			    final HtmlSubmitInput button = formLogin.getInputByName("Search");
			    final HtmlTextInput searchbar = formLogin.getInputByName("value");
			   
			    
			//Assigns each parameter to its respective field variable
			    searchbar.type(songname);
			   
			    
		    //Submits form and loads the next page
			    final HtmlPage page2 = button.click();
			    
			   webClient.close();
		    }finally{
		    	
		    }
		}
	
	
}
