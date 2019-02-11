import gettype from './utils/gettype';

export default class QueryBuilder {
    constructor(baseUrl = '') {
        this._baseUrl = baseUrl;
        this._filters = {};
        this._sorts = [];
        this._includes = [];
        this._appends = [];
        this._fields = {};
        this._page = null;
        this._params = {};
    }

    static defineCustomParameterNames(customParameterNames) {
        this._customParameterNames = customParameterNames;
    }

    static forgetCustomParameterNames() {
        delete this._customParameterNames;
    }

    static getParameterName(parameter) {
        return this._customParameterNames && this._customParameterNames.hasOwnProperty(parameter)
            ? this._customParameterNames[parameter]
            : parameter;
    }

    baseUrl(baseUrl) {
        this._baseUrl = baseUrl;
        return this;
    }

    param(...args) {
        switch (args.length) {
            case 1:
                if (gettype(args[0]) !== 'object') {
                    throw new Error();
                }
                Object.entries(args[0]).forEach(entry => {
                    this.param(...entry);
                });
                break;
            case 2:
                if (
                    gettype(args[0]) !== 'string' ||
                    ['string', 'number', 'array'].indexOf(gettype(args[1])) === -1
                ) {
                    throw new Error();
                }
                this._params[args[0]] = args[1];
                break;
            default:
                throw new Error();
        }
        return this;
    }

    forgetParam(...args) {
        if (args.length === 0) {
            this._params = {};
        } else {
            args.forEach(arg => {
                switch (gettype(arg)) {
                    case 'array':
                        this.forgetParam(...arg);
                        break;
                    case 'string':
                        delete this._params[arg];
                        break;
                    default:
                        throw new Error();
                }
            });
        }

        return this;
    }

    include(...args) {
        args.forEach(arg => {
            switch (gettype(arg)) {
                case 'array':
                    this.include(...arg);
                    break;
                case 'string':
                    this._includes.push(arg);
                    break;
                default:
                    throw new Error();
            }
        });
        return this;
    }

    forgetInclude(...args) {
        if (args.length === 0) {
            this._includes = [];
        } else {
            args.forEach(arg => {
                switch (gettype(arg)) {
                    case 'array':
                        this.forgetInclude(...arg);
                        break;
                    case 'string':
                        this._includes = this._includes.filter(v => v !== arg);
                        break;
                    default:
                        throw new Error();
                }
            });
        }

        return this;
    }

    append(...args) {
        args.forEach(arg => {
            switch (gettype(arg)) {
                case 'array':
                    this.append(...arg);
                    break;
                case 'string':
                    this._appends.push(arg);
                    break;
                default:
                    throw new Error();
            }
        });
        return this;
    }

    forgetAppend(...args) {
        if (args.length === 0) {
            this._appends = [];
        } else {
            args.forEach(arg => {
                switch (gettype(arg)) {
                    case 'array':
                        this.forgetAppend(...arg);
                        break;
                    case 'string':
                        this._appends = this._appends.filter(v => v !== arg);
                        break;
                    default:
                        throw new Error();
                }
            });
        }

        return this;
    }

    filter(...args) {
        switch (args.length) {
            case 1:
                if (gettype(args[0]) !== 'object') {
                    throw new Error();
                }
                Object.entries(args[0]).forEach(entry => {
                    this.filter(...entry);
                });
                break;
            case 2:
                if (
                    gettype(args[0]) !== 'string' ||
                    ['string', 'number', 'array'].indexOf(gettype(args[1])) === -1
                ) {
                    throw new Error();
                }
                this._filters[args[0]] = args[1];
                break;
            default:
                throw new Error();
        }
        return this;
    }

    forgetFilter(...args) {
        if (args.length === 0) {
            this._filters = {};
        } else {
            args.forEach(arg => {
                switch (gettype(arg)) {
                    case 'array':
                        this.forgetFilter(...arg);
                        break;
                    case 'string':
                        delete this._filters[arg];
                        break;
                    default:
                        throw new Error();
                }
            });
        }

        return this;
    }

    sort(...args) {
        args.forEach(arg => {
            switch (gettype(arg)) {
                case 'array':
                    this.sort(...arg);
                    break;
                case 'string':
                    this._sorts.push(arg);
                    break;
                default:
                    throw new Error();
            }
        });
        return this;
    }

    forgetSort(...args) {
        if (args.length === 0) {
            this._sorts = [];
        } else {
            args.forEach(arg => {
                switch (gettype(arg)) {
                    case 'array':
                        this.forgetSort(...arg);
                        break;
                    case 'string':
                        this._sorts = this._sorts.filter(v => v !== arg);
                        break;
                    default:
                        throw new Error();
                }
            });
        }

        return this;
    }

    fields(...args) {
        switch (args.length) {
            case 1:
                if (gettype(args[0]) !== 'object') {
                    throw new Error();
                }
                Object.entries(args[0]).forEach(entry => {
                    this.fields(...entry);
                });
                break;
            case 2:
                if (gettype(args[0]) !== 'string' || gettype(args[1]) !== 'array') {
                    throw new Error();
                }
                this._fields[args[0]] = args[1];
                break;
            default:
                throw new Error();
        }
        return this;
    }

    forgetFields(...args) {
        if (args.length === 0) {
            this._fields = {};
        } else {
            args.forEach(arg => {
                switch (gettype(arg)) {
                    case 'array':
                        this.forgetFields(...arg);
                        break;
                    case 'string':
                        delete this._fields[arg];
                        break;
                    default:
                        throw new Error();
                }
            });
        }

        return this;
    }

    page(page) {
        if (gettype(page) !== 'number' && gettype(page) !== 'string') {
            throw new Error();
        }
        this._page = page;
        return this;
    }

    forgetPage() {
        this._page = null;
        return this;
    }

    tap(callback) {
        if (typeof callback !== 'function') {
            throw new Error();
        }
        callback(this);
        return this;
    }

    when(condition, callback) {
        if (gettype(callback) !== 'function') {
            throw new Error();
        }
        condition = gettype(condition) === 'function' ? condition() : condition;
        if (condition) {
            callback(this);
        }
        return this;
    }

    build() {
        const params = [];

        Object.entries(this._filters).forEach(entry => {
            params.push([`${QueryBuilder.getParameterName('filter')}[${entry[0]}]`, entry[1]]);
        });

        this._sorts.length &&
            params.push([QueryBuilder.getParameterName('sort'), this._sorts.join(',')]);

        this._includes.length &&
            params.push([QueryBuilder.getParameterName('include'), this._includes.join(',')]);

        this._appends.length &&
            params.push([QueryBuilder.getParameterName('append'), this._appends.join(',')]);

        Object.entries(this._fields).forEach(entry => {
            params.push([
                `${QueryBuilder.getParameterName('fields')}[${entry[0]}]`,
                entry[1].join(','),
            ]);
        });

        if (this._page) {
            params.push([QueryBuilder.getParameterName('page'), this._page]);
        }

        Object.entries(this._params).forEach(entry => {
            params.push(entry);
        });

        const paramsString = params
            .sort((a, b) => (a[0] < b[0] ? -1 : 1))
            .map(entry => `${encodeURIComponent(entry[0])}=${encodeURIComponent(entry[1])}`)
            .join('&');

        return `${this._baseUrl}?${paramsString}`;
    }
}
