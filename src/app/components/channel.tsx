async function getData(station: string) {
  const url = new URL('http://localhost:3000/api/channels')
  url.searchParams.set('station', station)

  const res = await fetch(url, { next: { revalidate: 10 } })
  if (!res.ok) {
    throw new Error('Failed to fetch API')
  }

  return res.json()
}

export default async function Channel({ station }: { station: string }) {
  const data = await getData(station)

  const channelMap = data.channelMap
  const deviceName = data.deviceName

  const statusMap: { [key: string]: string[] } = {
    D: ['未启用', 'border-gray-300'],
    E: ['启动', 'border-green-300'],
    I: ['空闲', 'border-green-400 bg-green-400/20'],
    C: ['充电中', 'border-yellow-400'],
    P: ['启动中', 'border-blue-300 bg-blue-300/20'],
    default: ['无效', ''],
  }

  function getLabel(status: string) {
    return status in statusMap ? statusMap[status][0] : statusMap.default[0]
  }

  function getStyle(status: string) {
    return status in statusMap ? statusMap[status][1] : statusMap.default[1]
  }

  return (
    <div className="py-2">
      <div className="font-bold">{deviceName}</div>
      <ul className="grid grid-cols-5 mt-2 gap-2">
        {Object.keys(channelMap).map(key => (
          <li
            key={key}
            className={`relative border-y-2 p-2 pr-3 ${getStyle(
              channelMap[key].channelStatus
            )}`}
          >
            {channelMap[key].channelStatus === 'C' && (
              <span
                className="absolute left-0 bottom-0 right-0 bg-yellow-300/20 z-0"
                style={{
                  top: (channelMap[key].chargedTime / (9 * 60)) * 100 + '%',
                }}
              />
            )}
            <div className="text-xs z-10">{key}</div>
            <div className="text-sm z-10">
              {getLabel(channelMap[key].channelStatus)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
