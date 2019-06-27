<template>
	<div>
		<p class="form">
			<v-btn @click="get()">
				get
			</v-btn>
			<v-btn @click="draw_objects()">
				draw
			</v-btn>
			<v-btn @click="clear()">
				clear
			</v-btn>
			<v-btn @click="push_positions()">
				push_positions
			</v-btn>
			<v-btn @click="report_today()">
				report_today
			</v-btn>
			<!--						{{devices.data[0].id}}-->
			<!--						{{positions.data[0].deviceId}}-->
		</p>
		<div class="index" id="map"></div>
	</div>
</template>

<script>
    // import axios from 'axios'
    export default {
        data() {
            return {
                devices: [],
                positions: [],
                map: null,
                report: [],
                objects: []
                /*
								* {
								* marker
								* path
								* lastPos
								* device
								* cur_drawed_path
								* }
								* */
            };
        },
        methods: {
            async get() {
                this.clear()
                this.devices = (await this.$axios.get('http://10.1.255.208:9999/api/devices')).data
                this.positions = (await this.$axios.get('http://10.1.255.208:9999/api/positions')).data
                this.draw_objects()
            },
            draw_objects() {
                let self = this
                this.positions.forEach(function (pos) {
                    self.devices.forEach(function (dev) {
                        if (dev.id === pos.deviceId)
                            self.objects.push(
                                {
                                    marker: self.$l.marker([pos.latitude, pos.longitude]).addTo(self.map)
                                        .bindPopup(`${dev.name}`),
                                    path: [],
                                    lastPos: pos,
                                    device: dev,
                                    cur_drawed_path: null
                                }
                            )
                    })

                })
								this.draw_objects_path()
            },
            draw_objects_path() {
                for (let j = 0; j < this.objects.length; j++) {
                    try {
                        this.map.removeLayer(this.objects[j].cur_drawed_path)
                    } catch (e) {
												console.log(`cur_drawed_path пока еще пуст ${e}`)
                    }
                    this.objects[j].cur_drawed_path =  this.$l.polyline(this.objects[j].path, {color: 'red'}).addTo(this.map)
                }
            },
            clear() {
                let self = this
                this.objects.forEach(function (item) {
                    try {
                        self.map.removeLayer(item.marker)
                        self.map.removeLayer(item.cur_drawed_path)
                    } catch (e) {
                        console.log(`невозможно удалить один из объектров или его путь ${e}`)
                    }
                })
								try {
                    self.map.removeLayer(this.report)
                } catch (e) {
										console.log(`невозможно удалить отчет ${e}`)
                }
                this.objects = []
                this.devices = []
                this.positions = []
            },
            async push_positions() {
                this.positions = (await this.$axios.get('http://10.1.255.208:9999/api/positions')).data
                for (let i = 0; i < this.positions.length; i++) {
                    for (let j = 0; j < this.objects.length; j++) {
                        if (this.objects[j].device.id === this.positions[i].deviceId) {
                            if(this.objects[j].path.length >= 10) {
                                this.objects[j].path.remove(0,0)
														}
                            this.objects[j].path.push([this.positions[i].latitude, this.positions[i].longitude])
                            this.objects[j].marker.setLatLng([this.positions[i].latitude, this.positions[i].longitude])
                            this.objects[j].lastPos = this.positions[i]
                        }
                    }

                }
                this.draw_objects_path()
            },
            async report_today() {
                this.report = []
                console.log(Date())
                let report = (await this.$axios.get('http://10.1.255.208:9999/api/reports/route?deviceId=1&from=1019-06-27T00:00:00Z&to=2019-06-28T00:00:00Z')).data
                let report_data = []
								report.forEach(function (dot) {
                    report_data.push([dot.latitude, dot.longitude])
                })
                this.report = this.$l.polyline(report_data, {color: 'red'}).addTo(this.map);
            },
						timer_action() {
                if(this.objects.length > 0) {
                    this.push_positions()
								}
						}
        },
        mounted() {
            this.map = this.$l.map('map', {zoomControl: false}).setView([56.96, 60.57], 15);
            this.$l.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
                maxZoom: 18,
                attribution: `Tracking3 v.${this.$app_version}`,
                id: 'mapbox.streets'
            }).addTo(this.map);
            this.$l.control.zoom({
                position: 'topright'
            }).addTo(this.map);
            try {
                this.get()
                setInterval(this.timer_action, 3000)
            } catch (e) {
								console.log(`произошла неведомая хуйня; ${e} `)
            }
        },
    }
</script>

<style>
	.form {
		position: absolute;
		z-index: 999;
	}

	.index {
		position: absolute;
		z-index: 0;
		width: 100%;
		height: 100%;
	}
</style>
