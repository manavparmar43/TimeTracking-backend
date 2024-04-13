const removeSqlInjection = (search_keyword: string): string => {
  // Remove SQL Injection
  const forbiddenCharsRegex = /[^\w\s,.]/gi;
  const sqlKeywordsRegex =
    /\b(SELECT|FROM|WHERE|AND|OR|UPDATE|DELETE|INSERT|CREATE|DROP|ALTER|TRUNCATE|EXEC|DECLARE|XP_CMDSHELL|RESTORE|BACKUP)\b/gi;
  search_keyword = search_keyword
    .replace(forbiddenCharsRegex, '')
    .replace(sqlKeywordsRegex, '');
  return search_keyword;
};

export default removeSqlInjection;
