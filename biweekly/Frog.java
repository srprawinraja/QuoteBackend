public class Frog {
    public static void main(String[] args) {
        String croakOfFrogs = "croakcroa";
        int[] freq = new int[5];
        for(char c:croakOfFrogs.toCharArray()){
            if(c=='c'){
                freq[0]++;
            } else if(c=='r'){
                freq[1]++;
            } else if(c=='o'){
                freq[2]++;
            } else if(c=='a'){
                freq[3]++;
            } else if(c=='k'){
                freq[4]++;
            }
        }
        if(freq[0] == freq[1] && freq[1] == freq[2] && freq[2] == freq[3] && freq[3] == freq[4]){
            System.out.println(freq[0]);
        } else {
            System.out.println(-1);
        }
    }
}
