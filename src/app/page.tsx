import Image from 'next/image'
import Channel from '@/app/components/channel'

const stations = [
  // 理工研究生公寓2号楼
  'http://wx.99cda.com/cda-wx/chargingBike.do?q=0400000000001532&qType=device&openId=ozCzC0p1m5Tm_BUHr_pQDS5HZCw8',
  // 理工大学研究生2号公寓楼北侧西部设备二
  'http://wx.99cda.com/cda-wx/chargingBike.do?q=0400000000011639&qType=device&openId=ozCzC0p1m5Tm_BUHr_pQDS5HZCw8',
  // 理工大学15号公寓楼西侧
  'http://wx.99cda.com/cda-wx/chargingBike.do?q=0400000000013510&qType=device&openId=ozCzC0p1m5Tm_BUHr_pQDS5HZCw8',
  // 理工大学光电院教学楼北侧
  'http://wx.99cda.com/cda-wx/chargingBike.do?q=0400000000013707&qType=device&openId=ozCzC0p1m5Tm_BUHr_pQDS5HZCw8',
  // 理工大学求是楼南侧
  'http://wx.99cda.com/cda-wx/chargingBike.do?q=0400000000013985&qType=device&openId=ozCzC0p1m5Tm_BUHr_pQDS5HZCw8',
]

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between dark:bg-black dark:text-white">
      <div>
        <div className="text-lg my-4">🔋 Charging Stations</div>
        <div className="grid lg:grid-cols-2 gap-4">
          {stations.map(station => (
            <Channel key={station} station={station} />
          ))}
        </div>
      </div>
      <footer className="text-xs text-center my-4">
        Made with ❤️ SpencerWoo
      </footer>
    </main>
  )
}
