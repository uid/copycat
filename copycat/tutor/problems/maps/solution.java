import java.util.Map;

public class MapsClass {
  	public static String getValue(Map<String, String> map, String key, String df) {
    	if (map.containsKey(key)) {
    		return map.get(key);
    	} else {
    		map.put(key, df);
    		return df;
    	}
  	}
}
