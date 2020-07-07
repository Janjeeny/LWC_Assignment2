public class SearchAccounts {
	 @AuraEnabled(cacheable=true)
    public static List<Account> findAccounts(String searchTerm, Integer recLimit) {
        String key = '%' + searchTerm + '%';
        return [
            SELECT Id, Name, Phone, Industry
            FROM Account
            WHERE Name LIKE :key 
            LIMIT :recLimit
        ];
    }
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(String searchTerm) {
        system.debug('searchTerm ==>'+searchTerm );
        return [
            SELECT Id, Name, Phone,AccountNumber,Type,Website,Site
            FROM Account
            WHERE Type = :searchTerm 
            LIMIT 20
        ];
    }
    
    @AuraEnabled(cacheable=true)
    public static ID GetAnyAccountRT()
    {
        return [select id from RecordType Where SobjectType ='Account' limit 1].id;
    }
    
   }