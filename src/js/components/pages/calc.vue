<style lang="scss" type="text/scss">
    .calc {

        &__wrapper {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
        }

        &__btn {
            margin-top: 20px;
        }

        &__equally {
            margin: 10px;
            font-size: 20px;
        }

        &__error {
            color: red;
            margin: 10px 0 0;
            font-size: 18px;
        }
    }
</style>
<template>
    <div class="calc">
        <h1>Калькулятор</h1>
        <div class="calc__wrapper" v-if="fractions&&fractions.length">
            <template v-for="(item, index) in fractions">
                <fraction
                        :value="[item.numTop, item.numBottom]"
                        @input="val => { item.numTop=val[0]; item.numBottom=val[1] }"
                        :key="index"
                        v-if="item.component=='fraction'"
                ></fraction>
                <operator
                        v-model="item.operator"
                        :key="index"
                        :operators="operators"
                        v-if="item.component=='operator'"
                ></operator>
                <operator
                        v-model="item.bracked"
                        :key="index"
                        :operators="item.brackeds"
                        v-if="item.component=='bracked'"
                ></operator>
            </template>
            <span class="calc__equally">=</span>
            <fraction
                    disabled
                    :value="[result.numTop, result.numBottom]"
            ></fraction>
        </div>
        <button class="calc__btn" @click="addFraction" type="button">Add Fraction</button>
        <button class="calc__btn" @click="delFraction(fractions)" type="button">Del Fraction</button>
        <div v-if="error" class="calc__error">
            {{error}}
        </div>
    </div>
</template>
<script>
    import fraction from '@/components/elements/fraction.vue'
    import operator from '@/components/elements/operator.vue'

    export default {
        components: {fraction, operator},

        data() {
            return {
                fractions: [],
                result: this.defaultFraction(),
                errorCode: 1,
                operators: [
                    {
                        value: '+',
                        priority: 1,
                        process(leftTop, leftBottom, rightTop, rightBottom) {
                            return { numTop: leftTop * rightBottom + rightTop * leftBottom, numBottom: leftBottom * rightBottom }
                        },
                    },
                    {
                        value: '-',
                        priority: 1,
                        process(leftTop, leftBottom, rightTop, rightBottom) {
                            return { numTop: leftTop * rightBottom - rightTop * leftBottom, numBottom: leftBottom * rightBottom }
                        },
                    },
                    {
                        value: '*',
                        priority: 2,
                        process(leftTop, leftBottom, rightTop, rightBottom) {
                            return { numTop: leftTop * rightTop, numBottom: leftBottom * rightBottom }
                        },
                    },
                    {
                        value: '/',
                        priority: 2,
                        process(leftTop, leftBottom, rightTop, rightBottom) {
                            return { numTop: leftTop * rightBottom, numBottom: leftBottom * rightTop }
                        },
                    },
                ],
                beforeBrackeds: [
                    {value: ''},
                    {value: '('},
                ],
                afterBrackeds: [
                    {value: ''},
                    {value: ')'},
                ],
            }
        },

        computed: {
            error() {
                switch (this.errorCode) {
                    case 1:
                        return 'Заполните все поля ( Ошибка деления на 0 )';
                        break;
                    case 2:
                        return 'Неправильно расставлены скобки';
                        break;
                    default:
                        return '';
                }

            },
        },

        watch: {
            fractions: {
                handler(fractions) {
                    this.errorCode = 0;
                    let nullDivision = false;
                    this.result = this.defaultFraction();
                    // клонируем массив
                    let tmpFraction = fractions.map(el => {
                        let newEl = Object.assign({}, el);
                        if (!newEl.operator && !newEl.bracked) {
                            newEl.numTop = parseInt(newEl.numTop) || 0;
                            newEl.numBottom = parseInt(newEl.numBottom) || 0;
                        }
                        nullDivision = newEl.numBottom === 0 || nullDivision;
                        return newEl;
                    });

                    // проверка деления на 0
                    if (nullDivision) {
                        this.errorCode = 1;
                        return;
                    }

                    // увеличиваем приоритет оператора если в скобках
                    let tempN = 0;
                    let coefPriority = this.operators.reduce((res, cur) => (cur.priority > res ? cur.priority : res), 0);
                    tmpFraction.map(el => {
                        if (el.bracked) {
                            switch (el.bracked.value) {
                                case '(':
                                    tempN++;
                                    break;
                                case ')':
                                    tempN--;
                                    break;
                                default:
                            }
                        } else if (el.operator) {
                            el.operator.newPriority = parseInt(el.operator.priority);
                            el.operator.newPriority += tempN * coefPriority;
                        }
                    });

                    // должно быть ровное кол-во открытых и закрытых скобок!
                    if (tempN !== 0) {
                        this.errorCode = 2;
                        return;
                    }

                    // вычисляем действия операторов по приоритетам, сначала с самым большим приоритетом
                    let maxPriority = tmpFraction.reduce((res, cur) => (cur.operator && cur.operator.newPriority > res ? cur.operator.newPriority : res), 0);
                    // console.log(maxPriority);
                    for (let n = maxPriority; n > 0; n--) {
                        // выполнение операций по приоритету
                        for (let i = 0; i < tmpFraction.length; i++) {
                            if (tmpFraction[i].operator && tmpFraction[i].operator.newPriority === n) {
                                console.log(tmpFraction[i].operator);
                                let tempLeft = tmpFraction[i - 2];
                                let tempRight = tmpFraction[i + 2];
                                let result = tmpFraction[i].operator.process(tempLeft.numTop, tempLeft.numBottom, tempRight.numTop, tempRight.numBottom);
                                tempLeft.numTop = result.numTop;
                                tempLeft.numBottom = result.numBottom;
                                nullDivision = tempLeft.numBottom === 0 || nullDivision;
                                this.delFraction(tmpFraction, i);
                                i--;
                            }

                            // проверка деления на 0
                            if (nullDivision) {
                                this.errorCode = 1;
                                return;
                            }
                        }
                    }

                    // выводим результат
                    let result = tmpFraction.filter(el => !el.bracked).shift();
                    if (result) {
                        let nod = this.nod(result.numTop, result.numBottom);
                        result.numTop /= nod;
                        result.numBottom /= nod;
                        this.result = result;
                    }

                },
                deep: true
            }
        },

        methods: {
            defaultOperator() {
                return {
                    component: 'operator',
                    operator: this.operators[0],
                }
            },

            defaultFraction() {
                return {
                    component: 'fraction',
                    numTop: '',
                    numBottom: '',
                }
            },

            defaultBracket(brackeds) {
                return {
                    component: 'bracked',
                    brackeds: brackeds,
                    bracked: brackeds[0],
                }
            },

            addFraction() {
                if (this.fractions.length % 4 !== 0) this.fractions.push(this.defaultOperator());
                this.fractions.push(this.defaultBracket(this.beforeBrackeds));
                this.fractions.push(this.defaultFraction());
                this.fractions.push(this.defaultBracket(this.afterBrackeds));
            },

            delFraction(fractions, i) {
                if (fractions.length > 4) {
                    fractions.splice(i ? i : fractions.length - 4, 4)
                }
            },

            nod(n, m) {
                if (m > 0) {
                    var k = n % m;
                    return this.nod(m, k);
                }
                else {
                    return Math.abs(n);
                }
            },

        },

        created() {
            this.addFraction();
            this.addFraction();
        },

    }
</script>
