<script lang="ts" setup>
import { ref, computed, onMounted, watch, defineProps } from 'vue'
import Header from '../components/Header/index.vue'
import { Search,Download,CopyDocument } from '@element-plus/icons-vue'

interface ProxyServer {
  name: string
  status: string
  responseTime?: number
}

const props = defineProps<{
  launchParam?: { code?: string; payload?: string } | null
}>()

const proxyServers = ref<ProxyServer[]>([])
const selectedProxy = ref('ghproxy.net')
const githubUrl = ref('')
const activeTab = ref<'git' | 'wget' | 'curl' | 'direct'>('git')
const isDownloading = ref(false)
const downloadProgress = ref(0)

const loadProxyServers = async () => {
  try {
    const proxyResult = await window.ztools.db.get('proxyServers')

    if(!proxyResult ){
      window.ztools.showNotification('代理服务器列表为空,请先添加代理服务器')
      return
    }

    const result = JSON.parse(proxyResult.data)
    if (result && Array.isArray(result)) {
      proxyServers.value = result
    } else {
      window.ztools.showNotification('代理服务器列表为空,请先添加代理服务器')
      return
    }

    const savedProxy = await window.ztools.db.get('selectedProxy')
    if (savedProxy && savedProxy.data) {
      const savedProxyName = savedProxy.data
      const exists = proxyServers.value.some(s => s.name === savedProxyName)
      if (exists) {
        selectedProxy.value = savedProxyName
      } else if (proxyServers.value.length > 0) {
        selectedProxy.value = proxyServers.value[0].name
      }
    } else if (proxyServers.value.length > 0) {
      selectedProxy.value = proxyServers.value[0].name
    }
  } catch (error) {
      window.ztools.showNotification('代理服务器列表加载失败，请检查数据库连接')
  }
}

const saveSelectedProxy = async () => {
  try {
    await window.ztools.db.put({ _id: 'selectedProxy', data: selectedProxy.value })
  } catch (error) {
    console.error('保存代理选择失败:', error)
  }
}

watch(selectedProxy, () => {
  saveSelectedProxy()
})

const proxyUrl = computed(() => {
  return `https://${selectedProxy.value}/${githubUrl.value}`
})

const gitCloneCommand = computed(() => {
  return `git clone ${proxyUrl.value}`
})

const wgetCommand = computed(() => {
  return `wget ${proxyUrl.value}`
})

const curlCommand = computed(() => {
  return `curl -O ${proxyUrl.value}`
})

const directUrl = computed(() => {
  return proxyUrl.value
})

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    window.ztools.showNotification('已复制到剪贴板')
  } catch (err) {
    console.error('复制失败:', err)
  }
}

const getCopyText = () => {
  switch (activeTab.value) {
    case 'git':
      return gitCloneCommand.value
    case 'wget':
      return wgetCommand.value
    case 'curl':
      return curlCommand.value
    case 'direct':
      return directUrl.value
    default:
      return ''
  }
}

const downloadFile = async () => {
  if (!githubUrl.value.trim()) {
    window.ztools.showNotification('请输入要下载的GitHub文件URL')
    return
  }
  
  isDownloading.value = true
  downloadProgress.value = 0
  
  try {
    const savePath = await window.services.downloadFile(proxyUrl.value, {
      onProgress: (progress: number) => {
        downloadProgress.value = progress
      }
    })
    
    window.ztools.showNotification(`下载完成，文件已保存到: ${savePath}`)
  } catch (error: any) {
    console.error('下载失败:', error)
    window.ztools.showNotification(`下载失败: ${error.message || '未知错误'}`)
  } finally {
    isDownloading.value = false
    downloadProgress.value = 0
  }
}

const handleLaunchParam = async (param: { code?: string; payload?: string }) => {
  if (!param.code || !param.payload) return
  
  githubUrl.value = param.payload
  
  if (param.code === 'download') {
    await downloadFile()
  } else if (param.code === 'copygitclone') {
    await copyToClipboard(gitCloneCommand.value)    
    window.ztools.hideMainWindow(true)
    window.ztools.outPlugin(true)
  }
}

watch(() => props.launchParam, (newParam) => {
  if (newParam) {
    handleLaunchParam(newParam)
  }
}, { immediate: true })

onMounted(() => {
  loadProxyServers()
})
</script>

<template>
  <div class="github-proxy">
    <el-container>
      <Header current-view="home" @navigate="$emit('navigate', $event)" />

      <el-main>
        <div class="header-section">
          <h1 class="title">
            <span class="title-black">Github</span>
            <span class="title-blue">Proxy</span>
          </h1>
          <p class="description">
            支持GitHub（Git Clone、Releases、Archive、Gist、Raw）文件加速访问，提升下载体验。
          </p>
        </div>

        <el-card class="input-card">
          <div class="input-row">
            <el-input
                  v-model="githubUrl"
                  style="max-width: 700px"
                  placeholder="请输入GitHub文件URL"
                  class="input-with-select"
                >
                  <template #prepend>
                    <el-select v-model="selectedProxy" placeholder="选择代理服务器" style="width: 150px">
                      <el-option
                        v-for="server in proxyServers"
                        :key="server.name"
                        :label="server.name"
                        :value="server.name"
                      >
                        <span>{{ server.name }}</span>
                        <span class="option-status" :class="{ success: server.status.includes('正常'), warning: server.status.includes('测试'), danger: !server.status.includes('正常') && !server.status.includes('测试') }">
                          {{ server.status }}
                        </span>
                      </el-option>
                    </el-select>
                  </template>
                  <template #append>
                    <el-button type="primary" @click="downloadFile" :icon="Download" :disabled="isDownloading">
                      {{ isDownloading ? `下载中 ${downloadProgress}%` : '下载' }}
                    </el-button>
                  </template>
                </el-input>
          </div>
        </el-card>

        <el-card class="commands-card">
          <el-tabs v-model="activeTab" class="command-tabs">
            <el-tab-pane label="Git Clone" name="git">
              <div class="command-content">                
                  <code class="command-code">{{ gitCloneCommand }}</code>
              </div>
            </el-tab-pane>
            <el-tab-pane label="Wget" name="wget">
              <div class="command-content">
                <code class="command-code">{{ wgetCommand }}</code>
              </div>
            </el-tab-pane>
            <el-tab-pane label="Curl" name="curl">
              <div class="command-content">
                <code class="command-code">{{ curlCommand }}</code>
              </div>
            </el-tab-pane>
            <el-tab-pane label="Direct Download" name="direct">
              <div class="command-content">
                <code class="command-code">{{ directUrl }}</code>
              </div>
            </el-tab-pane>
          </el-tabs>
          <div class="copy-section">
            <el-button type="primary" :icon="CopyDocument" @click="copyToClipboard(getCopyText())">
              复制
            </el-button>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.github-proxy {
  width: 100%;
  height: 100%;
}

.el-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.el-main {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  box-sizing: border-box;
  background-color: var(--bg-secondary);
}

.header-section {
  text-align: center;
  margin-bottom: 24px;
}

.title {
  font-size: 42px;
  font-weight: bold;
  margin: 0 0 12px 0;
}

.title-black {
  color: var(--text-primary);
}

.title-blue {
  color: #409EFF;
}

.description {
  color: var(--text-secondary);
  font-size: 14px;
  margin: 0;
}

.input-card {
  margin-bottom: 12px;
  border-radius: 8px;
}

.input-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.option-status {
  margin-left: 8px;
  font-size: 12px;
  color: var(--text-secondary);
}

.option-status.success {
  color: #67C23A;
}

.option-status.warning {
  color: #E6A23C;
}

.option-status.danger {
  color: #F56C6C;
}

.commands-card {
  border-radius: 8px;
}

.command-tabs {
  margin-bottom: 16px;
}

.command-content {
  padding: 16px;
  background-color: var(--bg-secondary);
  border-radius: 4px;
  min-height: 50px;
}

.command-code {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  color: var(--text-primary);
  word-break: break-all;
}

.copy-section {
  display: flex;
  justify-content: center;
  padding-top: 10px;
}

.input-with-select .el-input-group__prepend {
  background-color: var(--bg-secondary);
}
</style>