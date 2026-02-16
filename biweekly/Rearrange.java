import java.util.*;
public class Rearrange{
    public static void main(String[] args) {
        String sentence = "";
        int n = sentence.length();
        List<String> words = new ArrayList<>();
        addAllWords(words, sentence, n);
        int m = words.size();
        int[][] wordDetails = new int[m][2];
        for(int i=0; i<m; i++){
            wordDetails[i] = new int[]{i, words.get(i).length()}; // index, length
        }
        Arrays.sort(wordDetails, (a,b)->{
            if(a[1]==b[1]){
                return Integer.compare(a[0], b[0]);
            }
            return Integer.compare(a[1], b[1]);
        });

        String res="";
        for(int[] wordDetail:wordDetails){
            res=res+words.get(wordDetail[0])+" ";
        }
        int resLen=res.length();
        if(resLen>0 && res.substring(resLen-1, resLen).equals(" "))
                res = res.substring(0, resLen-1);
        System.out.println(res);
    }
    public static void addAllWords(List<String> words, String sentence, int n){
        int index=0;
        while(index<n){
            String word="";
            while(index<n && !sentence.substring(index, index+1).equals(" ")){
                word=word+sentence.substring(index, index+1);
                index++;
            }
            words.add(word);
            index++;
        }
    }

}