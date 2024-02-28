<template>
	<view class="">
		<view class="container">
			<canvas :style="prizeWrap" v-if="!canvasSrc" canvas-id="turntable" ref="turntableRef" class="turntable"
				@tap="handleTap"></canvas>
			<img class="turntable" :style="prizeWrap" v-else :src="canvasSrc" alt="" @tap="handleTap">
			<img class="start_go" v-if="lotteryConfig&&canvasSrc" :src="lotteryConfig.startImg" alt="" @tap="clickGo">
		</view>
	</view>
</template>

<script>
	import api from 'utils/api';
	// 生成随机颜色
	function getRandomColor() {
		const letters = '0123456789ABCDEF'
		let color = '#'
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)]
		}
		return color
	}
	export default {
		data() {
			return {
				canvasWidth: 0, //当前手机的画布大小
				prizeWrap: "transform: rotate(-90deg);",
				prizeList: [],
				clickAreas: [], // 存储每个扇形区域的点击范围
				isRotating: false, // 是否正在旋转
				rotateBaseDegree: 1800, // 基础旋转角度
				rotateDegree: 0, // 当前旋转角度
				rotateSpeed: 20, // 旋转速度，单位为度每帧
				perDegree: 0, //每个扇形角度
				timer: null,
				isWinIndex: 0, //中奖序号
				currentAward: {}, //当前中奖信息
				lotteryResult: {}, //抽奖时接口返回的抽奖结果
				turntableX: 0,
				turntableY: 0,
				canvasSrc: "", //把canvas转化为图片

				finishCount: 0, //绘画完成个数
				imgPathList:[], //奖项图片列表
				segmentImgPath:"",// 分割线图片
			}
		},
		props: {
			awardList: {
				type: Array,
				default: [],
			},
			currentLotteryId: {
				type: String,
			},
			lotteryConfig: {
				type: Object,
			}

		},
		mounted() {
			let _this = this
			this.canvasSrc = ''
			console.log("this.lotteryConfig", this.lotteryConfig)
			const query = uni.createSelectorQuery().in(this);

			// 为了适配不同的手机，动态获取 并设置 当前画布的大小
			query.selectAll(`.container`).boundingClientRect(data => {
				this.canvasWidth = data[0].width
				console.log("当前宽度-=-=", data[0])
				this.turntableX = data[0].left + data[0].width / 2
				this.turntableY = data[0].top + data[0].height / 2
				// this.drawTurntable()
			}).exec();
			
			// 分割线图片信息
			uni.getImageInfo({
				src: _this.lotteryConfig.segmentImg,
				success: (res) => {
					_this.segmentImgPath = res.path
				},
				fail: (error) => {
					console.error('绘制分割线-获取图片信息失败', error);
				}
			});
			console.log("this.awardList-=-=",this.awardList)
			this.prizeList = this.awardList
			this.imgPathList = []
			let imgFinish = 0
			this.prizeList.forEach(async(item,index)=>{
				let imgUrl = item.picUrl
				await uni.getImageInfo({
					src: imgUrl,
					success: (res) => {
						console.log("获取图片信息成功-=-=",item,index,res.path)
						_this.imgPathList.push({
							picPath:res.path,
							 picUrl:item.picUrl
						})
						// _this.imgPathList.splice(index, 0, res.path);
						imgFinish++
						if(imgFinish == _this.imgPathList.length && _this.segmentImgPath){
							console.log("加载完图片了，可以绘制")
							_this.drawTurntable()
						}
					},
					fail: (error) => {
						imgFinish++
						if(imgFinish == _this.imgPathList.length && _this.segmentImgPath){
							console.log("加载完图片了，可以绘制")
							_this.drawTurntable()
						}
						console.error('获取图片信息失败', error)
					}
				})
			})
			console.log("获取this.imgPathList=-=0",this.imgPathList)
			
			
			
		},
		methods: {
			drawTurntable() {
				let _this = this
				const ctx = uni.createCanvasContext('turntable', this)

				// 设置圆盘的大小
				let width = this.canvasWidth;
				let height = this.canvasWidth;
				let radius = width / 2 // 半径
				console.log("-=-=width, height, radius", width, height, radius)

				this.finishCount = 0
				console.log("分割线-=-=",this.lotteryConfig.segmentImg)
				
				
				// 动态计算扇形个数并绘制扇形区域
				const baseAngle = (2 * Math.PI) / this.prizeList.length
				this.perDegree = 360 / this.prizeList.length
				for (let i = 0; i < this.prizeList.length; i++) {
					const item = this.prizeList[i]

					const startAngle = i * baseAngle
					const endAngle = (i + 1) * baseAngle
					console.log("画这个---", i, item, startAngle, endAngle)

					ctx.beginPath()
					ctx.moveTo(radius, radius) // 移动到圆心
					ctx.arc(radius, radius, radius, startAngle, endAngle)
					// ctx.fillStyle = getRandomColor() // 随机颜色
					ctx.fillStyle = "white" // 随机颜色
					ctx.fill()
					ctx.closePath()

					// // 存储每个扇形区域的点击范围
					// this.clickAreas.push({
					// 	startAngle,
					// 	endAngle
					// })
					
					

					
					
					const imageWidth = radius; // 图片宽度为2px
					const imageHeight = 1; // 图片高度等于圆盘的直径
					
					ctx.save();
					ctx.translate(radius, radius);
					console.log("花了几条线")
					ctx.rotate(i * baseAngle);
					ctx.drawImage(_this.segmentImgPath, 0, 0, imageWidth, imageHeight);
					ctx.restore();
					
					
					
					

					// 绘制扇形区域内的图片
					let imgUrl = item.picUrl
					if (imgUrl) {
						console.log(" item.picUrl", i, imgUrl)
						
						const imgAngle = (startAngle + endAngle) / 2
						const centerX = Math.cos(imgAngle) * (radius / 1.5) + radius // 计算图片中心的x坐标
						const centerY = Math.sin(imgAngle) * (radius / 1.5) + radius // 计算图片中心的y坐标
						const imageWidth = 50 // 图片宽度
						const imageHeight = 50 // 图片高度
						
						ctx.save();
						ctx.translate(centerX, centerY)
						ctx.rotate(imgAngle + Math.PI / 2)
						const currentIndex = this.imgPathList.filter((item)=>item.picUrl == imgUrl)
						ctx.drawImage(currentIndex[0].picPath, -imageWidth / 2, -imageHeight / 2, imageWidth,
							imageHeight)
						ctx.restore();
						

					} else {

						// 绘制扇形区域的内容
						ctx.save()
						const textAngle = (startAngle + endAngle) / 2 // 文字所在的角度
						const textX = radius + Math.cos(textAngle) * (radius / 1.5) // 文字的 x 坐标
						const textY = radius + Math.sin(textAngle) * (radius / 1.5) // 文字的 y 坐标
						ctx.font = 'bold 12px Arial' // 设置字体样式
						ctx.fillStyle = '#635050' // 设置字体颜色为白色
						ctx.textAlign = 'center'
						ctx.textBaseline = 'middle'
						ctx.translate(textX, textY)
						ctx.rotate(textAngle + Math.PI / 2)
						ctx.fillText(item.name + '--' + i, 0, 0)
						ctx.restore()
					}
					// // 绘制扇形区域的内容
					// ctx.save()
					// const textAngle = (startAngle + endAngle) / 2 // 文字所在的角度
					// const textX = radius + Math.cos(textAngle) * (radius / 1.5) // 文字的 x 坐标
					// const textY = radius + Math.sin(textAngle) * (radius / 1.5) // 文字的 y 坐标
					// ctx.font = 'bold 12px Arial' // 设置字体样式
					// ctx.fillStyle = '#635050' // 设置字体颜色为白色
					// ctx.textAlign = 'center'
					// ctx.textBaseline = 'middle'
					// ctx.translate(textX, textY)
					// ctx.rotate(textAngle + Math.PI / 2)
					// ctx.fillText(item.name + '--' + i, 0, 0)
					// ctx.restore()
					

				}


				setTimeout(() => {
					// ctx.draw()
					// console.log("canvas转化为图片-=-=")
					// console.log("获取this.imgPathList=-=0",_this.imgPathList)
					// // 直接使用canvas在真机上会有层级问题
					// _this.$nextTick(() => {
					// 	uni.canvasToTempFilePath({
					// 		canvasId: 'turntable',
					// 		success: function(res) {
					// 			console.log('res1', res)
					// 			_this.canvasSrc = res.tempFilePath
					// 			_this.$emit('hiddenLoading');
					// 		}
					// 	}, _this)
					// })
					ctx.draw(false,setTimeout(() => {
					  wx.canvasToTempFilePath({
					    canvasId: 'turntable',
					    fileType: 'png',
					    success(res) {
					      console.log(res.tempFilePath);
						  _this.canvasSrc = res.tempFilePath
						  _this.$emit('hiddenLoading');
					    },
					    fail(error) {
					      console.log(error);
					    }
					  },_this)
					},500))
					
				}, 200)
				console.log("走到最后--", this.finishCount)

			},
			handleTap(event) {
				console.log("000", event, this.clickAreas)
				const {
					x,
					y
				} = event.detail
				console.log("圆心在屏幕中的位置", this.turntableX, this.turntableY)
				let centerX = this.turntableX
				let centerY = this.turntableY
				let radius = this.canvasWidth / 2; //半径

				// 计算点击点相对于圆心的距离
				const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)

				// 计算点击点与水平方向的夹角（弧度）
				let angle = Math.atan2(y - centerY, x - centerX) + Math.PI /2

				if (angle < 0) {
					angle += Math.PI * 2
				}

				// 计算点击点在大转盘上对应的扇形区域
				const sector = Math.floor(angle / (Math.PI * 2 / this.prizeList.length))
				console.log("suoyin", sector, this.isWinIndex)
				console.log("this.prizeList[sector]", this.prizeList[sector])
				let _goodsList = this.prizeList[sector].goodsList
				if(_goodsList.length>0){
					console.log("有奖品",_goodsList)
					uni.navigateTo({
						url: `/pages/goods/goods-detail/index?id=${_goodsList[0].spuId}&from=lottery`
					});
				}else if(this.prizeList[sector].type =='3'){
					console.log("楚惠豆")
					// 楚惠豆
					uni.navigateTo({
						url: `/pages/lottery/points-detail?awardinfo=` + encodeURIComponent(JSON.stringify(this.prizeList[sector]))
					});
				}
			},

			clickGo() {
				// this.prizeWrap = `
				// 			transform: rotate(0deg);
				// 			`
				console.log("开始抽奖---", this.isRotating)
				if (this.isRotating) return
				// // 测试-=-=-
				// this.lotteryResult = {
				// 	awardId:"1737370688544907266",
				// 	awardName:"测试---55",
				// 	isWin: '1',
				// }
				// setTimeout(()=>{
				// 	console.log("this.awardList-=-=1",this.awardList)
				// 		let resultAward = null
				// 		if(this.lotteryResult.isWin =='1'){
				// 			resultAward = this.awardList.filter((item, index) => {
				// 				if (item.id == this.lotteryResult.awardId) {
				// 					this.isWinIndex = index
				// 					console.log("中奖信息-=-=",this.isWinIndex, item)
				// 					return item
				// 				}
				// 			})
				// 			this.currentAward = resultAward[0]
				// 		}else{
				// 			resultAward = this.awardList.filter((item, index) => {
				// 				if(!item.id){
				// 					this.isWinIndex = index
				// 					return item
				// 				}
				// 			})
				// 			this.currentAward = resultAward[0]
				// 		}
				// 	// 设置哪个奖品的索引能中奖
				// 	console.log("中奖信息-=-=resultAward", resultAward,this.currentAward, this.isWinIndex)
				// 	this.startRotate()
				// },20)
				// // 测试-----
				
				let _this = this
				if(this.lotteryConfig.usePoint == '1'){
					uni.showModal({
						title: '提示',
						content: `抽奖需扣减${_this.lotteryConfig.points}楚惠豆，是否继续?`,
						success: function (res) {
							if (res.confirm) {
								console.log('用户点击确定-调用抽奖接口');
								_this.goLottery()
							} else if (res.cancel) {
								console.log('用户点击取消');
								this.isStart = false
							}
						}
					});
				}else{
					_this.goLottery()
				}

				
				


			},
			goLottery(){
				// 去抽奖
				api.startLottery(this.currentLotteryId).then((res) => {
					console.log("抽奖信息-=-=", res)
					this.lotteryResult = res.data
					if (res.ok) {
						let resultAward = null
						if(this.lotteryResult.isWin =='1'){
							resultAward = this.awardList.filter((item, index) => {
								if (item.id == this.lotteryResult.awardId) {
									this.isWinIndex = index
									console.log("中奖信息-=-=",this.isWinIndex, item)
									return item
								}
							})
							this.currentAward = resultAward[0]
							this.startRotate()
						}else{
							resultAward = this.awardList.filter((item, index) => {
								if(!item.id){
									this.isWinIndex = index
									return item
								}
							})
							if(resultAward.length>0){
								this.currentAward = resultAward[0]
								this.startRotate()
							}else{
								uni.showToast({
									title: this.lotteryResult.errMsg,
									icon: 'none',
									duration: 2000
								});
								this.isStart = false
							}
							
						}
						this.$emit('gameOver');
						console.log("中奖信息-=-=resultAward", resultAward,this.lotteryResult, this.currentAward, this.isWinIndex)
				
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none',
							duration: 3000
						});
						this.isStart = false

					}
				
				
				})
			},
			startRotate() {

				this.isRotating = true;
				const rotateDeg = this.rotateBaseDegree -90  + (360 - (this.isWinIndex * this.perDegree) - this.perDegree /
					2)
				this.prizeWrap = `
							transform: rotate(${rotateDeg}deg);
							transition: all 4s ease;
							`
				this.timer = setTimeout(() => {
					// this.prizeWrap = `
					// 		`
					this.isRotating = false;
					clearTimeout(this.timer)
					console.log("旋转结束")
					if(this.lotteryResult.isWin=='0'&&!this.lotteryResult.errMsg && this.currentAward){
						uni.showToast({
							title: this.currentAward.name,
							icon: 'none',
							duration: 2000
						});
					}
					if(this.lotteryResult.isWin=='1'){
						// 获奖了
						this.$emit('onLotteryResult', this.currentAward, this.lotteryResult);
					}
					this.prizeWrap = `
								transform: rotate(-90deg);
								`
				}, 4000)
			},
		},
	}
</script>

<style scoped>
	.container {
		width: 540rpx;
		height: 540rpx;
		position: relative;
	}

	.start_go {
		width: 112rpx;
		height: 166rpx;
		z-index: 1;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -68%);
	}

	.turntable {
		width: 540rpx;
		height: 540rpx;
	}
</style>