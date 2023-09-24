import Channel from '@/app/components/channel'

const stations = [
  {
    name: '硕博2 #1',
    url: 'http://wx.99cda.com/cda-wx/chargingBike.do?q=0400000000001532&qType=device&openId=ozCzC0p1m5Tm_BUHr_pQDS5HZCw8',
  },
  {
    name: '硕博2 #2',
    url: 'http://wx.99cda.com/cda-wx/chargingBike.do?q=0400000000011639&qType=device&openId=ozCzC0p1m5Tm_BUHr_pQDS5HZCw8',
  },
  {
    name: '小麦公社西侧',
    url: 'http://wx.99cda.com/cda-wx/chargingBike.do?q=0400000000013510&qType=device&openId=ozCzC0p1m5Tm_BUHr_pQDS5HZCw8',
  },
  {
    name: '光电楼北侧',
    url: 'http://wx.99cda.com/cda-wx/chargingBike.do?q=0400000000013707&qType=device&openId=ozCzC0p1m5Tm_BUHr_pQDS5HZCw8',
  },
  {
    name: '求是楼南侧',
    url: 'http://wx.99cda.com/cda-wx/chargingBike.do?q=0400000000013985&qType=device&openId=ozCzC0p1m5Tm_BUHr_pQDS5HZCw8',
  },
]

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div>
        <div className="my-4 relative inline-block">
          <span className="icon-[iconoir--ev-plug-charging] w-6 h-6"></span>
          <div className="absolute bottom-0.5 -right-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {stations.map(station => (
            <Channel
              key={station.name}
              name={station.name}
              station={station.url}
            />
          ))}
        </div>
      </div>
      <footer className="text-xs text-center mt-12 mb-4">
        Made with ❤️ SpencerWoo
      </footer>
    </main>
  )
}
