import query from '../src/query';
import QueryBuilder from '../src/QueryBuilder';

describe('query', () => {
    it('should return QueryBuilder instance', () => {
        expect(query()).toBeInstanceOf(QueryBuilder);
    });
});
