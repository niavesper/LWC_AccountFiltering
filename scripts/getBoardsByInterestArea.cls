public without sharing class getBoardsByInterestArea {
   
    @AuraEnabled(Cacheable=false)
    public static List<Board__c> filteredBoards (List<String> filterAreas, String searchkey) {

        System.debug(filterAreas.size());

        List<Board__c> results = new List<Board__c>();
        String activeStatus = 'Active';
        String asNeededStatus = 'As Needed';

        String key = '%' + searchkey + '%';
        
        String boardQuery;
        // List<Board__c> boardQuery = new List<Board__c>();

        if (filterAreas == null || filterAreas.size() == 0 && searchkey == null) {
            boardQuery = 'SELECT Id, Department__r.Name,Name,Board_Summary__c,Interest_Area__c FROM Board__c WHERE (Status__c = :activeStatus OR Status__c = :asNeededStatus) ORDER BY Name ASC';
        }
        else if (filterAreas == null || filterAreas.size() == 0 && searchkey != null) {
            boardQuery = 'SELECT Id, Department__r.Name,Name,Board_Summary__c,Interest_Area__c FROM Board__c WHERE (Status__c = :activeStatus OR Status__c = :asNeededStatus) AND Name LIKE :key ORDER BY Name ASC';
        }
        else if (filterAreas != null && (searchkey == null || searchkey == '') ) {
            boardQuery = 'SELECT Id, Department__r.Name,Name,Board_Summary__c,Interest_Area__c FROM Board__c WHERE (Status__c = :activeStatus OR Status__c = :asNeededStatus) AND Interest_Area__c INCLUDES(';
            for (String s : filterAreas) {
                boardQuery += '\'' + String.escapeSingleQuotes(s) + '\',';
            }

            boardQuery = boardQuery.left(boardQuery.length() -1);
            boardQuery += ') ORDER BY Name ASC';

            System.debug(boardQuery);

        } else if (filterAreas != null && (searchkey != null || searchkey != '')) {
            boardQuery = 'SELECT Id, Department__r.Name,Name,Board_Summary__c,Interest_Area__c FROM Board__c WHERE (Status__c = :activeStatus OR Status__c = :asNeededStatus) AND Interest_Area__c INCLUDES(';
                for (String s : filterAreas) {
                    boardQuery += '\'' + String.escapeSingleQuotes(s) + '\',';
                }

                boardQuery = boardQuery.left(boardQuery.length() -1);
                boardQuery += ') AND Name LIKE :key ORDER BY Name ASC';
        
            }
    

        System.debug(boardQuery);

        results = Database.query(boardQuery);

        return results;
    }

    @AuraEnabled(cacheable=false)
    public static List<Board_Seat__c> filteredSeats(List<String> filterAreas, String searchkey){
        
        List<Board_Seat__c> results = new List<Board_Seat__c>();
        String openForApplications = 'Yes';
        String key = '%' + searchkey + '%';
        String seatQuery;
        
        if (filterAreas == null || filterAreas.size() == 0 && searchkey == null) {
            seatQuery = 'SELECT Id, Board__r.Name, Open_for_Applications__c,Qualification__c FROM Board_Seat__c WHERE Open_for_Applications__c=:openForApplications ORDER BY Qualification__c ASC';
        }
        else if (filterAreas == null || filterAreas.size() == 0 && searchkey != null) {
            seatQuery = 'SELECT Id, Board__r.Name, Open_for_Applications__c,Qualification__c FROM Board_Seat__c WHERE Open_for_Applications__c=:openForApplications AND Qualification__c LIKE :key ORDER BY Board__r.Name ASC';
        }
        else if (filterAreas != null && (searchkey == null || searchkey == '') ) {
            seatQuery = 'SELECT Id, Board__r.Name, Open_for_Applications__c,Qualification__c FROM Board_Seat__c WHERE Open_for_Applications__c=:openForApplications AND Board__r.Interest_Area__c INCLUDES(';
            for (String s : filterAreas) {
                seatQuery += '\'' + String.escapeSingleQuotes(s) + '\',';
            }


            seatQuery = seatQuery.left(seatQuery.length() -1);
            seatQuery += ') ORDER BY Qualification__c ASC';

            System.debug(seatQuery);

        } else if (filterAreas != null && (searchkey != null || searchkey != '')) {
            seatQuery = 'SELECT Id, Board__r.Name, Open_for_Applications__c,Qualification__c FROM Board_Seat__c WHERE Open_for_Applications__c=:openForApplications AND Board__r.Interest_Area__c INCLUDES(';
                for (String s : filterAreas) {
                    seatQuery += '\'' + String.escapeSingleQuotes(s) + '\',';
                }

                seatQuery = seatQuery.left(seatQuery.length() -1);
                seatQuery += ') AND Qualification__c LIKE :key ORDER BY Qualification__c ASC';
        
            }
    

        System.debug(seatQuery);
        try {
            results = Database.query(seatQuery);
        } catch (Exception e) {
            e.getMessage();
        }
       

        return results;


}
}
