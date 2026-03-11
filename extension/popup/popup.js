document.addEventListener('DOMContentLoaded', async () => {

  const toggleSwitch = document.getElementById('toggleSwitch')
  const statusText = document.getElementById('statusText')
  const totalSolved = document.getElementById('totalSolved')
  const avgTime = document.getElementById('avgTime')
  const successRate = document.getElementById('successRate')
  const logList = document.getElementById('logList')

  // load current enabled state from storage
  chrome.storage.sync.get(['isEnabled', 'stats', 'logs'], (result) => {

    // default to enabled if not set
    const isEnabled = result.isEnabled !== false
    toggleSwitch.checked = isEnabled
    updateStatusText(isEnabled)

    // load stats if available
    if (result.stats) {
      updateStats(result.stats)
    }

    // load logs if available
    if (result.logs && result.logs.length > 0) {
      renderLogs(result.logs)
    }
  })

  // handle toggle
  toggleSwitch.addEventListener('change', () => {
    const isEnabled = toggleSwitch.checked

    chrome.storage.sync.set({ isEnabled }, () => {
      updateStatusText(isEnabled)

      // notify background script
      chrome.runtime.sendMessage({
        type: 'TOGGLE_EXTENSION',
        payload: { isEnabled }
      })
    })
  })

  const updateStatusText = (isEnabled) => {
    statusText.textContent = isEnabled
      ? '✅ Active — watching for CAPTCHAs on all pages'
      : '⏸️ Paused — extension is disabled'
  }

  const updateStats = (stats) => {
    totalSolved.textContent = stats.total || 0
    avgTime.textContent = stats.avgTime ? `${stats.avgTime}ms` : '0ms'
    const rate = stats.total > 0
      ? Math.round((stats.success / stats.total) * 100)
      : 0
    successRate.textContent = `${rate}%`
  }

  const renderLogs = (logs) => {
    logList.innerHTML = ''
    // show last 5 only
    const recent = logs.slice(-5).reverse()

    recent.forEach(log => {
      const li = document.createElement('li')
      li.className = `log-item ${log.success ? '' : 'failed'}`
      li.innerHTML = `
        <span class="log-site">${log.website}</span>
        <span class="log-time">${log.timeTaken}ms</span>
      `
      logList.appendChild(li)
    })
  }

})