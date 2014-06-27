import org.junit.runner.Description;
import org.junit.runner.Result;
import org.junit.runner.notification.Failure;
import org.junit.runner.notification.RunListener;

import org.json.JSONObject;
import org.json.JSONArray;

public class UserTestListener extends RunListener {

    JSONObject output;
    boolean failed = false;
    boolean pass = true;

    @Override
    public void testRunStarted(Description description) {
      output = new JSONObject();
      output.put("tests", new JSONArray());
    }

    @Override
    public void testFailure(Failure failure) {
      failed = true;
      pass = false;
      JSONObject test = new JSONObject();
      test.put("name", failure.getDescription().toString());
      test.put("trace", failure.getTrace());
      test.put("exception", failure.getException());
      test.put("message", failure.getMessage());
      output.append("tests", test);
    }
    
    @Override
    public void testFinished(Description description) {
        if (!failed) {
            JSONObject test = new JSONObject();
            test.put("name", description.toString());
            output.append("tests", test);
        }
        failed = false;
    }

    @Override
    public void testRunFinished(Result result) {
      output.append("result", Boolean.toString(pass));
      System.out.println(output);
    }
}
