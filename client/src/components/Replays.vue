<template>
  <div class="replay">
      <div class="filter-form">
          <el-form :inline="true" label-width="100px">
            <el-form-item label="职业：">
              <el-select v-model="filters.className" placeholder="请选择职业">
                    <el-option
                        v-for="item in classNameOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="套牌：">
              <el-select v-model="filters.archetypeName" placeholder="请选择套牌">
                    <el-option
                        v-for="item in archetypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="只显示获胜：">
                <el-switch
                    v-model="filters.won"
                    active-color="#13ce66"
                    inactive-color="#e0e0e0">
                </el-switch>
            </el-form-item>
            <el-form-item label="排名：">
                <span>传说</span>
                <el-switch
                    v-model="filters.isLegend"
                    active-color="#13ce66"
                    inactive-color="#e0e0e0">
                </el-switch>
                <el-input-number
                    class="rank-input"
                    v-if="!filters.isLegend"
                    v-model="filters.rankStart"
                    :min="1"
                    :max="25"
                ></el-input-number>
                <el-input-number
                    class="rank-input"
                    v-if="!filters.isLegend"
                    v-model="filters.rankEnd"
                    :min="1"
                    :max="25"
                ></el-input-number>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
            </el-form-item>
          </el-form>
      </div>
      <div class="replay-list">
          <ul>
              <li
                  v-for="(r, idx) in replays"
                  :key="idx"
                  class="replay-item"
               >
                  <a class="replay-link" :href="r.url" target="_blank">
                   <div :class="['player', {won: r.player2_won}]">
                        <span class="arch-type">
                            {{r.player2_archetype_name}}
                            <!-- <a :href="r.player2_archurl" class="arch&#45;link" target="_blank">查看套牌</a> -->
                        </span>
                        <span class="normal rank-badge" v-if="r.player2_legend_rank === 'None'">R{{r.player2_rank}}</span>
                        <span class="legend rank-badge" v-else>L{{r.player2_legend_rank}}</span>
                    </div>
                    <span class="vs">vs</span>
                    <div :class="['player', {won: r.player1_won}]">
                        <span class="arch-type">
                            {{r.player1_archetype_name}}
                            <!-- <a :href="r.player1_archurl" class="arch&#45;link" target="_blank">查看套牌</a> -->
                        </span>
                        <span class="normal rank-badge" v-if="r.player1_legend_rank === 'None'">R{{r.player1_rank}}</span>
                        <span class="legend rank-badge" v-else>L{{r.player1_legend_rank}}</span>
                        <span class="time">{{getTimeAgo(r.add_time)}}</span>
                    </div>
                  </a>
              </li>
          </ul>
      </div>
  </div>
</template>

<script>
import axios from 'axios';
import timeAgo from 'node-time-ago';

export default {
    name: 'Replays',
    data () {
        return {
            filters: {
                won: false,
                archetypeName: 'ALL',
                className: 'ALL',
                isLegend: false,
                rankStart: 1,
                rankEnd: 25,
            },
            classNameOptions: [
                {label: '所有', value: "ALL"},
                {label: '德鲁伊', value: "DRUID"},
                {label: '猎人', value: "HUNTER"},
                {label: '法师', value: "MAGE"},
                {label: '圣骑士', value: "PALADIN"},
                {label: '牧师', value: "PRIEST"},
                {label: '潜行者', value: "ROUGE"},
                {label: '萨满', value: "SHAMAN"},
                {label: '术士', value: "WARLOCK"},
                {label: '战士', value: "WARRIOR"},
            ],
            archetypeOptions: [
                {label: '所有', value: "ALL"},
            ],
            replays: []
        }
    },
    created() {
        this.getReplays();
    },
    watch: {
        'filters.className'() {
            if (this.filters.className !== 'ALL') {
                this.getArchOptions();
                this.filters.archetypeName = 'ALL';
            }
            else {
                this.archetypeOptions = [{label: '所有', value: "ALL"}];
            }
        }
    },
    methods: {
        getTimeAgo(time) {
            return timeAgo(time);
        },
        onSubmit() {
            this.getReplays();
        },
        getArchOptions() {
            const loading = this.$loading({
                lock: true,
                spinner: 'el-icon-loading'
            });
            axios.get('/api/archetype', {params: {
                className: this.filters.className
            }})
                .then(res => {
                    loading.close();
                    this.archetypeOptions = res.data.data.map(d => ({
                        label: d,
                        value: d
                    }));
                    this.archetypeOptions.unshift({label: '所有', value: '所有'});
                })
                .catch(() => {
                    loading.close();
                });
        },
        getReplays() {
            const loading = this.$loading({
                lock: true,
                spinner: 'el-icon-loading'
            });
            axios.get('/api/replays', {params: this.filters})
                .then(res => {
                    loading.close();
                    this.replays = res.data.data;
                })
                .catch(() => {
                    loading.close();
                });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

.filter-form {
    width: 600px;
}
.replay {
    margin-top: 80px;
}    

.player {
    display: inline-block;
}

.replay-list {
    width: 620px;
}

.replay-item {
    /* margin-bottom: 10px; */
    padding: 10px 0;
    border-bottom: 1px dashed #d4d4d4;
}

.replay-link {
    color: #929292;

    .player.won {
        color: #409eff;
    }
}

.arch-type {
    display: inline-block;
    width: 200px;
    line-height: 20px;
    height: 20px;
    vertical-align: middle;
}

.vs {
    margin: 0 10px;
}

.arch-link {
    font-size: 12px;
}

.rank-input {
    width: 120px;
}

.rank-badge {
    border-radius: 50%;
    display: inline-block;
    min-width: 30px;
    height: 25px;
    line-height: 25px;
    font-size: 13px;
    text-align: center;
    vertical-align: middle;
    color: #fff;
    background-color: #57d5e2;

    &.legend {
        background-color: #ff9143;
    }
}

.time {
    margin-left: 20px;
    font-size: 12px;
}
</style>
