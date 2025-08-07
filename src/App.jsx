import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { Label } from '@/components/ui/label.jsx'
import { 
  Search, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Moon,
  Sun,
  History,
  Heart,
  Download,
  Share2,
  Filter,
  Loader2,
  Star,
  Clock,
  BookOpen,
  Users,
  Award,
  Globe,
  Trash2
} from 'lucide-react'
import './App.css'

function App() {
  const [eiinNumber, setEiinNumber] = useState('')
  const [instituteData, setInstituteData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [searchHistory, setSearchHistory] = useState([])
  const [favorites, setFavorites] = useState([])
  const [activeTab, setActiveTab] = useState('search')

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('eiinSearchHistory')
    const savedFavorites = localStorage.getItem('eiinFavorites')
    const savedTheme = localStorage.getItem('eiinTheme')
    
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory))
    }
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark')
    }
  }, [])

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('eiinTheme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const searchInstitute = async () => {
    if (!eiinNumber.trim()) {
      setError('Please enter an EIIN number')
      return
    }

    setLoading(true)
    setError('')
    setInstituteData(null)

    try {
      const response = await fetch(`http://202.72.235.218:8082/api/v1/institute/list?eiinNo=${eiinNumber.trim()}`)
      const data = await response.json()

      if (data.status === 'success' && data.data && data.data.length > 0) {
        const institute = data.data[0]
        setInstituteData(institute)
        
        // Add to search history
        const newHistoryItem = {
          eiinNo: institute.eiinNo,
          instituteName: institute.instituteName,
          instituteNameBn: institute.instituteNameBn,
          searchDate: new Date().toISOString()
        }
        
        const updatedHistory = [newHistoryItem, ...searchHistory.filter(item => item.eiinNo !== institute.eiinNo)].slice(0, 10)
        setSearchHistory(updatedHistory)
        localStorage.setItem('eiinSearchHistory', JSON.stringify(updatedHistory))
      } else {
        setError('No institute found with this EIIN number')
      }
    } catch (err) {
      setError('Failed to fetch institute data. Please check your internet connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchInstitute()
    }
  }

  const toggleFavorite = (institute) => {
    const isFavorite = favorites.some(fav => fav.eiinNo === institute.eiinNo)
    let updatedFavorites
    
    if (isFavorite) {
      updatedFavorites = favorites.filter(fav => fav.eiinNo !== institute.eiinNo)
    } else {
      const favoriteItem = {
        eiinNo: institute.eiinNo,
        instituteName: institute.instituteName,
        instituteNameBn: institute.instituteNameBn,
        addedDate: new Date().toISOString()
      }
      updatedFavorites = [favoriteItem, ...favorites]
    }
    
    setFavorites(updatedFavorites)
    localStorage.setItem('eiinFavorites', JSON.stringify(updatedFavorites))
  }

  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem('eiinSearchHistory')
  }

  const clearFavorites = () => {
    setFavorites([])
    localStorage.removeItem('eiinFavorites')
  }

  const searchFromHistory = (eiinNo) => {
    setEiinNumber(eiinNo)
    setActiveTab('search')
    // Trigger search after a small delay to allow tab change
    setTimeout(() => {
      searchInstitute()
    }, 100)
  }

  const exportToPDF = () => {
    if (!instituteData) return
    
    // Create a simple text content for PDF
    const content = `
Institute Information Report

Institute Name: ${instituteData.instituteName}
Institute Name (Bengali): ${instituteData.instituteNameBn}
EIIN Number: ${instituteData.eiinNo}
Type: ${instituteData.instituteTypeName}
Year: ${instituteData.year}

Location:
Division: ${instituteData.divisionName} (${instituteData.divisionNameBn})
District: ${instituteData.districtName} (${instituteData.districtNameBn})
Thana: ${instituteData.thanaName} (${instituteData.thanaNameBn})
Mouza: ${instituteData.mouzaName} (${instituteData.mouzaNameBn})

Contact Information:
${instituteData.mobile ? `Mobile: ${instituteData.mobile}` : ''}
${instituteData.email ? `Email: ${instituteData.email}` : ''}

Survey Information:
Status: ${instituteData.submissionStatus}
Verification: ${instituteData.verification}
Submission Date: ${instituteData.submissionDate || 'N/A'}
Circular Expiry: ${instituteData.circularExpiryDate || 'N/A'}

Generated on: ${new Date().toLocaleString()}
    `
    
    // Create a blob and download
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `institute_${instituteData.eiinNo}_report.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareInstitute = () => {
    if (!instituteData) return
    
    const shareText = `${instituteData.instituteName} (${instituteData.instituteNameBn}) - EIIN: ${instituteData.eiinNo}`
    
    if (navigator.share) {
      navigator.share({
        title: 'Institute Information',
        text: shareText,
        url: window.location.href
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Institute information copied to clipboard!')
      })
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Submitted':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'Not Verified':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Submitted':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300'
      case 'Not Verified':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300'
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    } p-4`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="h-12 w-12 text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              EIIN Institute Search
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Find detailed information about educational institutes using EIIN numbers
          </p>
          
          {/* Theme Toggle */}
          <div className="flex items-center justify-center mt-4 space-x-2">
            <Sun className="h-4 w-4" />
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
              className="data-[state=checked]:bg-indigo-600"
            />
            <Moon className="h-4 w-4" />
            <Label className="text-sm text-gray-600 dark:text-gray-300">Dark Mode</Label>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="animate-slide-up">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="search" className="flex items-center space-x-2">
                <Search className="h-4 w-4" />
                <span>Search</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center space-x-2">
                <History className="h-4 w-4" />
                <span>History ({searchHistory.length})</span>
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center space-x-2">
                <Heart className="h-4 w-4" />
                <span>Favorites ({favorites.length})</span>
              </TabsTrigger>
            </TabsList>

            {/* Search Tab */}
            <TabsContent value="search">
              <div className="space-y-8">
                {/* Search Section */}
                <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Search className="h-5 w-5 mr-2 text-indigo-600" />
                      Search Institute
                    </CardTitle>
                    <CardDescription>
                      Enter the EIIN (Educational Institute Identification Number) to get complete institute information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3">
                      <Input
                        type="text"
                        placeholder="Enter EIIN Number (e.g., 118632)"
                        value={eiinNumber}
                        onChange={(e) => setEiinNumber(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 text-lg transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
                        disabled={loading}
                      />
                      <Button 
                        onClick={searchInstitute} 
                        disabled={loading}
                        className="px-8 bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 transform hover:scale-105"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Searching...
                          </>
                        ) : (
                          'Search'
                        )}
                      </Button>
                    </div>
                    {error && (
                      <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md animate-fade-in">
                        <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Results Section */}
                {instituteData && (
                  <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm animate-slide-up">
                    <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-2xl flex items-center">
                            <Building2 className="h-6 w-6 mr-3" />
                            {instituteData.instituteName}
                          </CardTitle>
                          <CardDescription className="text-indigo-100 text-lg">
                            {instituteData.instituteNameBn}
                          </CardDescription>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFavorite(instituteData)}
                            className="text-white hover:bg-white/20 transition-all duration-200"
                          >
                            <Heart 
                              className={`h-4 w-4 transition-all duration-200 ${
                                favorites.some(fav => fav.eiinNo === instituteData.eiinNo) 
                                  ? 'fill-current text-red-300 scale-110' 
                                  : 'hover:scale-110'
                              }`} 
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={exportToPDF}
                            className="text-white hover:bg-white/20 transition-all duration-200 hover:scale-110"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={shareInstitute}
                            className="text-white hover:bg-white/20 transition-all duration-200 hover:scale-110"
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      {/* Basic Information */}
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                              <BookOpen className="h-4 w-4 mr-2 text-indigo-600" />
                              Institute Details
                            </h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">EIIN Number:</span>
                                <Badge variant="outline" className="font-mono">{instituteData.eiinNo}</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Type:</span>
                                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                  {instituteData.instituteTypeName}
                                </Badge>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Type (বাংলা):</span>
                                <span className="font-medium">{instituteData.instituteTypeNameBn}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Year:</span>
                                <span className="font-medium">{instituteData.year}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-indigo-600" />
                              Location
                            </h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Division:</span>
                                <span className="font-medium">{instituteData.divisionName} ({instituteData.divisionNameBn})</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">District:</span>
                                <span className="font-medium">{instituteData.districtName} ({instituteData.districtNameBn})</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Thana:</span>
                                <span className="font-medium">{instituteData.thanaName} ({instituteData.thanaNameBn})</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Mouza:</span>
                                <span className="font-medium">{instituteData.mouzaName} ({instituteData.mouzaNameBn})</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                              <Phone className="h-4 w-4 mr-2 text-indigo-600" />
                              Contact Information
                            </h3>
                            <div className="space-y-2 text-sm">
                              {instituteData.mobile && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Mobile:</span>
                                  <span className="font-medium font-mono">{instituteData.mobile}</span>
                                </div>
                              )}
                              {instituteData.telephone && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Telephone:</span>
                                  <span className="font-medium font-mono">{instituteData.telephone}</span>
                                </div>
                              )}
                              {instituteData.email && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Email:</span>
                                  <span className="font-medium">{instituteData.email}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-indigo-600" />
                              Survey Information
                            </h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                                <Badge className={getStatusColor(instituteData.submissionStatus)}>
                                  {getStatusIcon(instituteData.submissionStatus)}
                                  <span className="ml-1">{instituteData.submissionStatus}</span>
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-400">Verification:</span>
                                <Badge className={getStatusColor(instituteData.verification)}>
                                  {getStatusIcon(instituteData.verification)}
                                  <span className="ml-1">{instituteData.verification}</span>
                                </Badge>
                              </div>
                              {instituteData.submissionDate && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Submission Date:</span>
                                  <span className="font-medium">{instituteData.submissionDate}</span>
                                </div>
                              )}
                              {instituteData.circularExpiryDate && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Circular Expiry:</span>
                                  <span className="font-medium">{instituteData.circularExpiryDate}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator className="my-6" />

                      {/* Additional Information */}
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                            <Users className="h-4 w-4 mr-2 text-indigo-600" />
                            Administrative
                          </h4>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Role:</span>
                              <span className="font-medium">{instituteData.roleName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Survey ID:</span>
                              <span className="font-mono">{instituteData.esurveyId}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                            <Globe className="h-4 w-4 mr-2 text-indigo-600" />
                            Codes
                          </h4>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Division:</span>
                              <span className="font-mono">{instituteData.divisionCode}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">District:</span>
                              <span className="font-mono">{instituteData.districtCode}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Thana:</span>
                              <span className="font-mono">{instituteData.thanaCode}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                            <Award className="h-4 w-4 mr-2 text-indigo-600" />
                            Status Flags
                          </h4>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Government:</span>
                              <Badge variant={instituteData.isGovt ? "default" : "secondary"}>
                                {instituteData.isGovt ? "Yes" : "No"}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Submission Expired:</span>
                              <Badge variant={instituteData.isSubmissionExpired ? "destructive" : "default"}>
                                {instituteData.isSubmissionExpired ? "Yes" : "No"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history">
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center">
                        <History className="h-5 w-5 mr-2 text-indigo-600" />
                        Search History
                      </CardTitle>
                      <CardDescription>
                        Your recent searches (last 10 searches)
                      </CardDescription>
                    </div>
                    {searchHistory.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearHistory}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear History
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {searchHistory.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No search history yet. Start searching to see your history here.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {searchHistory.map((item, index) => (
                        <div
                          key={item.eiinNo}
                          className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer animate-fade-in"
                          onClick={() => searchFromHistory(item.eiinNo)}
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">{item.instituteName}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{item.instituteNameBn}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              EIIN: {item.eiinNo} • {new Date(item.searchDate).toLocaleDateString()}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" className="hover:scale-110 transition-transform">
                            <Search className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites">
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center">
                        <Heart className="h-5 w-5 mr-2 text-indigo-600" />
                        Favorite Institutes
                      </CardTitle>
                      <CardDescription>
                        Your saved favorite institutes
                      </CardDescription>
                    </div>
                    {favorites.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearFavorites}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear Favorites
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {favorites.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No favorite institutes yet. Add institutes to favorites by clicking the heart icon.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {favorites.map((item, index) => (
                        <div
                          key={item.eiinNo}
                          className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer animate-fade-in"
                          onClick={() => searchFromHistory(item.eiinNo)}
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">{item.instituteName}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{item.instituteNameBn}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              EIIN: {item.eiinNo} • Added {new Date(item.addedDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" className="hover:scale-110 transition-transform">
                              <Search className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                const updatedFavorites = favorites.filter(fav => fav.eiinNo !== item.eiinNo)
                                setFavorites(updatedFavorites)
                                localStorage.setItem('eiinFavorites', JSON.stringify(updatedFavorites))
                              }}
                              className="text-red-500 hover:text-red-700 hover:scale-110 transition-all"
                            >
                              <Heart className="h-4 w-4 fill-current" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 dark:text-gray-400 text-sm animate-fade-in">
          <p>EIIN Institute Search Tool - Powered by Bangladesh Education Board API</p>
          <p className="mt-1">Enhanced with advanced UI/UX and modern features</p>
        </div>
      </div>
    </div>
  )
}

export default App

