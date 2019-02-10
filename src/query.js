import QueryBuilder from './QueryBuilder';

export default function query(...args) {
    return new QueryBuilder(...args);
}
