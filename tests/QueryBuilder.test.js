import QueryBuilder from '../src/QueryBuilder';

function qb() {
    return new QueryBuilder('/');
}

describe('QueryBuilder', () => {
    beforeEach(() => {
        QueryBuilder.forgetCustomParameterNames();
    });

    it('should set base url', () => {
        expect(
            qb()
                .baseUrl('/b')
                .build()
        ).toStrictEqual('/b?');
    });

    it('should apply custom parameter names', () => {
        QueryBuilder.defineCustomParameterNames({
            filter: 'FILTER',
            sort: 'SORT',
            include: 'INCLUDE',
            fields: 'FIELDS',
            page: 'PAGE',
        });

        expect(
            qb()
                .filter('a', 'b')
                .sort('c', 'd', 'e')
                .include('f', 'a')
                .fields('h', ['i', 'v'])
                .page(3)
                .build()
        ).toStrictEqual(
            '/?FIELDS%5Bh%5D=i%2Cv&FILTER%5Ba%5D=b&INCLUDE=f%2Ca&PAGE=3&SORT=c%2Cd%2Ce'
        );
    });

    it('should forget custom parameter names', () => {
        QueryBuilder.defineCustomParameterNames({
            page: 'PAGE',
        });

        QueryBuilder.forgetCustomParameterNames();

        expect(
            qb()
                .page(5)
                .build()
        ).toStrictEqual('/?page=5');
    });

    it('should return parameter name', () => {
        QueryBuilder.defineCustomParameterNames({
            page: 'PAGE',
        });

        expect(QueryBuilder.getParameterName('page')).toStrictEqual('PAGE');
        expect(QueryBuilder.getParameterName('filter')).toStrictEqual('filter');
    });

    it('should add params', () => {
        expect(
            qb()
                .param('a', 'b')
                .param('c', 'd')
                .build()
        ).toStrictEqual('/?a=b&c=d');

        expect(
            qb()
                .param({ a: 'b', c: 'd' })
                .build()
        ).toStrictEqual('/?a=b&c=d');
    });

    it('should not add params with invalid arguments', () => {
        expect(() =>
            qb()
                .param('a')
                .build()
        ).toThrowError();

        expect(() =>
            qb()
                .param('a', {})
                .build()
        ).toThrowError();

        expect(() =>
            qb()
                .param({
                    b: null,
                })
                .build()
        ).toThrowError();

        expect(() =>
            qb()
                .param('a', 'b', 'c')
                .build()
        ).toThrowError();
    });

    it('should forget params', () => {
        expect(
            qb()
                .param({ a: 'b', c: 'd', e: 'f' })
                .forgetParam(['a', 'e'])
                .build()
        ).toStrictEqual('/?c=d');

        expect(
            qb()
                .param({ a: 'b', c: 'd', e: 'f' })
                .forgetParam('c', 'e')
                .build()
        ).toStrictEqual('/?a=b');

        expect(
            qb()
                .param({ a: 'b', c: 'd' })
                .forgetParam()
                .build()
        ).toStrictEqual('/?');
    });

    it('should not forget params with invalid arguments', () => {
        expect(() =>
            qb()
                .forgetParam('a', {})
                .build()
        ).toThrowError();

        expect(() =>
            qb()
                .forgetParam(['b', null])
                .build()
        ).toThrowError();
    });

    it('should add includes', () => {
        expect(
            qb()
                .include('a', 'b')
                .build()
        ).toStrictEqual('/?include=a%2Cb');

        expect(
            qb()
                .include(['c', 'd'])
                .build()
        ).toStrictEqual('/?include=c%2Cd');
    });

    it('should not add includes with invalid arguments', () => {
        expect(() =>
            qb()
                .include('a', {})
                .build()
        ).toThrowError();

        expect(() =>
            qb()
                .include(['b', null])
                .build()
        ).toThrowError();
    });

    it('should forget includes', () => {
        expect(
            qb()
                .include('a', 'd', 'f', 'b')
                .forgetInclude(['d', 'f'])
                .build()
        ).toStrictEqual('/?include=a%2Cb');

        expect(
            qb()
                .include(['a', 'd', 'f', 'b'])
                .forgetInclude('a', 'f')
                .build()
        ).toStrictEqual('/?include=d%2Cb');

        expect(
            qb()
                .include(['a', 'd', 'f', 'b'])
                .forgetInclude()
                .build()
        ).toStrictEqual('/?');
    });

    it('should not forget includes with invalid arguments', () => {
        expect(() =>
            qb()
                .forgetInclude(null)
                .build()
        ).toThrowError();

        expect(() =>
            qb()
                .forgetInclude({})
                .build()
        ).toThrowError();

        expect(() =>
            qb()
                .forgetInclude([2, undefined])
                .build()
        ).toThrowError();
    });

    it('should apply filters', () => {
        expect(
            qb()
                .filter('a', 'b')
                .build()
        ).toStrictEqual('/?filter%5Ba%5D=b');

        expect(
            qb()
                .filter({ a: 'b', c: 'd' })
                .build()
        ).toStrictEqual('/?filter%5Ba%5D=b&filter%5Bc%5D=d');

        expect(
            qb()
                .filter({ a: 'b', c: ['f', 'd'] })
                .build()
        ).toStrictEqual('/?filter%5Ba%5D=b&filter%5Bc%5D=f%2Cd');
    });

    it('should not apply filters with invalid arguments', () => {
        expect(() =>
            qb()
                .filter('a')
                .build()
        ).toThrowError();

        expect(() =>
            qb()
                .filter('a', null)
                .build()
        ).toThrowError();

        expect(() =>
            qb()
                .filter({
                    a: {},
                    b: 'c',
                })
                .build()
        ).toThrowError();

        expect(() =>
            qb()
                .filter('a', 'b', 'c')
                .build()
        ).toThrowError();
    });

    it('should forget filters', () => {
        expect(
            qb()
                .filter({ a: 'b', c: 'd', e: 'f' })
                .forgetFilter(['a', 'e'])
                .build()
        ).toStrictEqual('/?filter%5Bc%5D=d');

        expect(
            qb()
                .filter({ a: 'b', c: 'd', e: 'f' })
                .forgetFilter('a', 'e')
                .build()
        ).toStrictEqual('/?filter%5Bc%5D=d');

        expect(
            qb()
                .filter({ a: 'b', c: 'd', e: 'f' })
                .forgetFilter()
                .build()
        ).toStrictEqual('/?');
    });

    it('should not forget filters with invalid arguments', () => {
        expect(() =>
            qb()
                .forgetFilter({ a: 'b' })
                .build()
        ).toThrowError();

        expect(() =>
            qb()
                .forgetFilter([3, {}])
                .build()
        ).toThrowError();
    });

    it('should apply sorts', () => {
        expect(
            qb()
                .sort('a', 'b')
                .build()
        ).toStrictEqual('/?sort=a%2Cb');

        expect(
            qb()
                .sort(['a', 'b'])
                .build()
        ).toStrictEqual('/?sort=a%2Cb');
    });

    it('should not apply sorts with invalid arguments', () => {
        expect(() =>
            qb()
                .sort(null)
                .build()
        ).toThrowError();

        expect(() =>
            qb()
                .sort(['a', {}])
                .build()
        ).toThrowError();
    });

    it('should forget sorts', () => {
        expect(
            qb()
                .sort('a', 'b', 'c', 'd')
                .forgetSort(['b', 'c'])
                .build()
        ).toStrictEqual('/?sort=a%2Cd');

        expect(
            qb()
                .sort(['a', 'b', 'c', 'd'])
                .forgetSort('a', 'b')
                .build()
        ).toStrictEqual('/?sort=c%2Cd');

        expect(
            qb()
                .sort(['a', 'b', 'c', 'd'])
                .forgetSort()
                .build()
        ).toStrictEqual('/?');
    });

    it('should not forget sorts with invalid arguments', () => {
        expect(() =>
            qb()
                .forgetSort(null)
                .build()
        ).toThrowError();

        expect(() =>
            qb()
                .forgetSort({})
                .build()
        ).toThrowError();

        expect(() =>
            qb()
                .forgetSort([2, undefined])
                .build()
        ).toThrowError();
    });

    it('should add fields', () => {
        expect(
            qb()
                .fields('a', ['b', 'c', 'd'])
                .build()
        ).toStrictEqual('/?fields%5Ba%5D=b%2Cc%2Cd');

        expect(
            qb()
                .fields({ a: ['b', 'c'], d: ['e', 'f'] })
                .build()
        ).toStrictEqual('/?fields%5Ba%5D=b%2Cc&fields%5Bd%5D=e%2Cf');
    });

    it('should not add fields with invalid arguments', () => {
        expect(() =>
            qb()
                .fields('a')
                .build()
        ).toThrowError();

        expect(() =>
            qb()
                .fields('a', 'b')
                .build()
        ).toThrowError();

        expect(() =>
            qb()
                .fields({
                    a: null,
                })
                .build()
        ).toThrowError();

        expect(() =>
            qb()
                .fields('a', 'b', 'c')
                .build()
        ).toThrowError();
    });

    it('should forget fields', () => {
        expect(
            qb()
                .fields('a', ['b', 'c'])
                .fields('d', ['e', 'f'])
                .forgetFields('d')
                .build()
        ).toStrictEqual('/?fields%5Ba%5D=b%2Cc');

        expect(
            qb()
                .fields({ a: ['b', 'c'], d: ['e', 'f'] })
                .forgetFields(['a'])
                .build()
        ).toStrictEqual('/?fields%5Bd%5D=e%2Cf');

        expect(
            qb()
                .fields({ a: ['b', 'c'], d: ['e', 'f'] })
                .forgetFields()
                .build()
        ).toStrictEqual('/?');
    });

    it('should not forget fields with invalid arguments', () => {
        expect(() =>
            qb()
                .forgetFields({})
                .build()
        ).toThrowError();

        expect(() =>
            qb()
                .forgetFields([null])
                .build()
        ).toThrowError();
    });

    it('should set page', () => {
        expect(
            qb()
                .page(3)
                .build()
        ).toStrictEqual('/?page=3');

        expect(
            qb()
                .page('5')
                .build()
        ).toStrictEqual('/?page=5');
    });

    it('should not set page with invalid arguments', () => {
        expect(() =>
            qb()
                .page([])
                .build()
        ).toThrowError();

        expect(() =>
            qb()
                .page(null)
                .build()
        ).toThrowError();
    });

    it('should forget page', () => {
        expect(
            qb()
                .page(3)
                .forgetPage()
                .build()
        ).toStrictEqual('/?');
    });

    it('should tap builder', () => {
        expect(
            qb()
                .tap(b => b.param('a', 'b'))
                .build()
        ).toStrictEqual('/?a=b');
    });

    it('should not tap builder with invalid arguments', () => {
        expect(() =>
            qb()
                .tap('not callback')
                .build()
        ).toThrowError();
    });

    it('should conditionally tap builder using when', () => {
        expect(
            qb()
                .when(true, b => b.page(2))
                .build()
        ).toStrictEqual('/?page=2');

        expect(
            qb()
                .when(false, b => b.page(2))
                .build()
        ).toStrictEqual('/?');

        expect(
            qb()
                .when(() => true, b => b.page(2))
                .build()
        ).toStrictEqual('/?page=2');

        expect(
            qb()
                .when(() => false, b => b.page(2))
                .build()
        ).toStrictEqual('/?');

        const name = '';

        expect(
            qb()
                .when(name, b => b.filter({ name }))
                .build()
        ).toStrictEqual('/?');
    });

    it('should not conditionally tap builder using when with invalid arguments', () => {
        expect(() =>
            qb()
                .when(true, 'not callback')
                .build()
        ).toThrowError();
    });

    it('should build query string correctly', () => {
        expect(
            qb()
                .filter('a', 'b')
                .filter({ d: 'e', f: 'c' })
                .sort('c')
                .when(true, b => b.forgetFilter('d'))
                .sort(['d', 'e', 'a'])
                .tap(b => b.forgetSort(['a']))
                .include('y', 'e', 's')
                .forgetInclude(['e'])
                .fields({
                    h: ['d'],
                    t: ['g', 'a'],
                })
                .forgetFields('h')
                .page(3)
                .param({
                    a: 'b',
                    u: 'a',
                    n: 'p',
                })
                .forgetParam('u', 'n')
                .build()
        ).toStrictEqual(
            '/?a=b&fields%5Bt%5D=g%2Ca&filter%5Ba%5D=b&filter%5Bf%5D=c&include=y%2Cs&page=3&sort=c%2Cd%2Ce'
        );
    });

    it('should alphabetically sort params in built string', () => {
        expect(
            qb()
                .fields('b', ['a'])
                .fields('c', ['d'])
                .param('a', 'd')
                .fields('a', ['h'])
                .param('z', 'd')
                .build()
        ).toStrictEqual('/?a=d&fields%5Ba%5D=h&fields%5Bb%5D=a&fields%5Bc%5D=d&z=d');
    });
});
