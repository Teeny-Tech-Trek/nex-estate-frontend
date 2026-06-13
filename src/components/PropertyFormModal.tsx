// import React, { useState, useEffect } from "react";
// import {
//   Plus, X, Save
// } from "lucide-react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Slider } from "@/components/ui/slider";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";

// // Default property structure for initialization
// const defaultProperty = {
//   title: "",
//   price: "",
//   location: "",
//   address: "",
//   bedrooms: "",
//   bathrooms: "",
//   area: "",
//   areaUnit: "sq ft",
//   status: "available",
//   type: "single_family",
//   yearBuilt: new Date().getFullYear(),
//   images: [],
//   description: "",
//   leads: 0,
//   views: 0,
//   favorite: false,
//   createdAt: new Date().toISOString().split("T")[0],
//   analytics: {
//     riskScore: 0,
//     investmentPotential: 0,
//     rentalYield: 0,
//     appreciation: 0,
//     demandScore: 0,
//     marketValue: 0,
//     pricePerSqFt: 0
//   },
//   hazards: [],
//   demographics: {
//     averageAge: 0,
//     averageIncome: "",
//     familyRatio: 0,
//     education: "",
//     populationDensity: "medium"
//   },
//   amenities: {
//     transit: [],
//     education: [],
//     shopping: [],
//     parks: [],
//     healthcare: [],
//     other: []
//   },
//   marketInsights: {
//     daysOnMarket: 0,
//     pricePerSqFt: 0,
//     comparableSales: 0,
//     marketTrend: "stable",
//     avgDaysOnMarket: 0
//   },
//   financials: {
//     monthlyRent: 0,
//     propertyTax: 0,
//     insurance: 0,
//     maintenance: 0,
//     hoa: 0
//   },
//   ownerInfo: {
//     name: "",
//     email: "",
//     phone: "",
//     since: new Date().toISOString().split("T")[0]
//   }
// };

// const PropertyFormModal = ({ isOpen, onClose, mode, initialData, onSave }) => {
//   const [propertyData, setPropertyData] = useState(defaultProperty);
//   const [files, setFiles] = useState([]);
//   const [previews, setPreviews] = useState([]);
//   const [deletedImages, setDeletedImages] = useState([]);

//   useEffect(() => {
//     if (initialData && mode === "edit") {
//       setPropertyData(initialData);
//       setPreviews(initialData.images || []);
//     } else {
//       setPropertyData(defaultProperty);
//       setPreviews([]);
//     }
//     setFiles([]);
//     setDeletedImages([]);
//   }, [initialData, isOpen, mode]);

//   const handleChange = (e) => {
//     setPropertyData({ ...propertyData, [e.target.name]: e.target.value });
//   };

//   const handleNestedChange = (section, key, value) => {
//     setPropertyData({
//       ...propertyData,
//       [section]: { ...propertyData[section], [key]: value },
//     });
//   };

//   const addHazard = () => {
//     setPropertyData({
//       ...propertyData,
//       hazards: [...propertyData.hazards, { type: "flood", level: "low", description: "" }],
//     });
//   };

//   const removeHazard = (index) => {
//     setPropertyData({
//       ...propertyData,
//       hazards: propertyData.hazards.filter((_, i) => i !== index),
//     });
//   };

//   const updateHazard = (index, key, value) => {
//     const updatedHazards = [...propertyData.hazards];
//     updatedHazards[index][key] = value;
//     setPropertyData({ ...propertyData, hazards: updatedHazards });
//   };

//   const toggleAmenity = (category, item) => {
//     const updatedAmenities = { ...propertyData.amenities };
//     if (updatedAmenities[category].includes(item)) {
//       updatedAmenities[category] = updatedAmenities[category].filter((i) => i !== item);
//     } else {
//       updatedAmenities[category].push(item);
//     }
//     setPropertyData({ ...propertyData, amenities: updatedAmenities });
//   };

//   const handleFileChange = (e) => {
//     const newFiles = Array.from(e.target.files);
//     setFiles([...files, ...newFiles]);
//     const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
//     setPreviews([...previews, ...newPreviews]);
//   };

//   const removeImage = (index) => {
//     if (index < propertyData.images.length) {
//       setDeletedImages([...deletedImages, propertyData.images[index]]);
//       setPropertyData({
//         ...propertyData,
//         images: propertyData.images.filter((_, i) => i !== index),
//       });
//     } else {
//       const fileIndex = index - propertyData.images.length;
//       setFiles(files.filter((_, i) => i !== fileIndex));
//     }
//     setPreviews(previews.filter((_, i) => i !== index));
//   };

//   const handleSubmit = () => {
//     onSave(propertyData, files, deletedImages);
//   };

//   const propertyTypes = [
//     "single_family",
//     "condo",
//     "townhouse",
//     "multi_family",
//     "commercial",
//     "land",
//   ];

//   const hazardTypes = ["flood", "earthquake", "fire", "landslide", "hurricane", "tornado"];

//   const hazardLevels = ["very_low", "low", "medium", "high", "very_high"];

//   const amenityOptions = {
//     transit: ["subway", "bus", "train", "light_rail", "airport"],
//     education: ["top_schools", "good_schools", "universities", "colleges"],
//     shopping: ["luxury_malls", "local_malls", "grocery", "boutiques"],
//     parks: ["community_parks", "nature_preserve", "playgrounds", "riverside_park"],
//     healthcare: ["hospital", "clinics", "specialty_clinics", "dentists"],
//     other: ["gym", "pool", "concierge", "security", "garage", "garden"],
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 text-white border-slate-700">
//         <DialogHeader>
//           <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
//             {mode === "add" ? "Add New Property" : "Edit Property"}
//           </DialogTitle>
//           <DialogDescription className="text-slate-300">
//             {mode === "add"
//               ? "Create a new property listing with comprehensive analytics and risk assessment."
//               : "Update property details and analytics."}
//           </DialogDescription>
//         </DialogHeader>

//         <Tabs defaultValue="basic" className="w-full">
//           <TabsList className="grid w-full grid-cols-5 bg-slate-800 p-1 rounded-lg">
//             <TabsTrigger value="basic" className="rounded-md text-xs text-slate-300 data-[state=active]:text-black ">
//               Basic Info
//             </TabsTrigger>
//             <TabsTrigger value="details" className="rounded-md text-xs text-slate-300 data-[state=active]:text-black">
//               Property Details
//             </TabsTrigger>
//             <TabsTrigger value="analytics" className="rounded-md text-xs text-slate-300 data-[state=active]:text-black">
//               Analytics
//             </TabsTrigger>
//             <TabsTrigger value="risks" className="rounded-md text-xs text-slate-300 data-[state=active]:text-black">
//               Risk Assessment
//             </TabsTrigger>
//             <TabsTrigger value="amenities" className="rounded-md text-xs text-slate-300 data-[state=active]:text-black">
//               Amenities
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="basic" className="space-y-4 mt-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <Label className="text-slate-300">Property Title *</Label>
//                 <Input
//                   name="title"
//                   placeholder="Luxury Downtown Penthouse"
//                   value={propertyData.title}
//                   onChange={handleChange}
//                   className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
//                 />
//               </div>
//               <div>
//                 <Label className="text-slate-300">Price *</Label>
//                 <Input
//                   name="price"
//                   placeholder="₹55,00,000"
//                   value={propertyData.price}
//                   onChange={handleChange}
//                   className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
//                 />
//               </div>
//               <div className="col-span-2">
//                 <Label className="text-slate-300">Location *</Label>
//                 <Input
//                   name="location"
//                   placeholder="Downtown Financial District"
//                   value={propertyData.location}
//                   onChange={handleChange}
//                   className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
//                 />
//               </div>
//               <div className="col-span-2">
//                 <Label className="text-slate-300">Full Address</Label>
//                 <Input
//                   name="address"
//                   placeholder="123 Skyline Boulevard, New York, NY 10001"
//                   value={propertyData.address}
//                   onChange={handleChange}
//                   className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
//                 />
//               </div>
//               <div>
//                 <Label className="text-slate-300">Property Type</Label>
//                 <Select
//                   value={propertyData.type}
//                   onValueChange={(value) => setPropertyData({ ...propertyData, type: value })}
//                 >
//                   <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
//                     <SelectValue placeholder="Select type" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-slate-800 border-slate-700">
//                     {propertyTypes.map((type) => (
//                       <SelectItem key={type} value={type} className="text-white">
//                         {type.replace("_", " ")}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div>
//                 <Label className="text-slate-300">Status</Label>
//                 <Select
//                   value={propertyData.status}
//                   onValueChange={(value) => setPropertyData({ ...propertyData, status: value })}
//                 >
//                   <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
//                     <SelectValue placeholder="Select status" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-slate-800 border-slate-700">
//                     <SelectItem value="available" className="text-white">Available</SelectItem>
//                     <SelectItem value="pending" className="text-white">Pending</SelectItem>
//                     <SelectItem value="sold" className="text-white">Sold</SelectItem>
//                     <SelectItem value="draft" className="text-white">Draft</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//             <div>
//               <Label className="text-slate-300">Images</Label>
//               <Input 
//                 type="file" 
//                 multiple 
//                 onChange={handleFileChange}
//                 className="bg-slate-800 border-slate-700 text-slate-300 file:bg-blue-600 file:text-white file:border-0"
//               />
//               <div className="flex flex-wrap gap-2 mt-2">
//                 {previews.map((preview, index) => (
//                   <div key={index} className="relative">
//                     <img src={preview} alt="preview" className="w-24 h-24 object-cover rounded" />
//                     <Button
//                       variant="ghost"
//                       className="absolute top-0 right-0 text-red-500 hover:text-red-400"
//                       onClick={() => removeImage(index)}
//                     >
//                       <X size={16} />
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </TabsContent>

//           <TabsContent value="details" className="space-y-4 mt-4">
//             <div className="grid grid-cols-3 gap-4">
//               <div>
//                 <Label className="text-slate-300">Bedrooms</Label>
//                 <Input
//                   type="number"
//                   name="bedrooms"
//                   placeholder="3"
//                   value={propertyData.bedrooms}
//                   onChange={handleChange}
//                   className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
//                 />
//               </div>
//               <div>
//                 <Label className="text-slate-300">Bathrooms</Label>
//                 <Input
//                   type="number"
//                   name="bathrooms"
//                   placeholder="2"
//                   value={propertyData.bathrooms}
//                   onChange={handleChange}
//                   className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
//                 />
//               </div>
//               <div>
//                 <Label className="text-slate-300">Year Built</Label>
//                 <Input
//                   type="number"
//                   name="yearBuilt"
//                   placeholder="2020"
//                   value={propertyData.yearBuilt}
//                   onChange={handleChange}
//                   className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
//                 />
//               </div>
//               <div className="col-span-2">
//                 <Label className="text-slate-300">Area</Label>
//                 <div className="flex gap-2">
//                   <Input
//                     name="area"
//                     placeholder="2400"
//                     value={propertyData.area}
//                     onChange={handleChange}
//                     className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
//                   />
//                   <Select
//                     value={propertyData.areaUnit}
//                     onValueChange={(value) => setPropertyData({ ...propertyData, areaUnit: value })}
//                   >
//                     <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-white">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent className="bg-slate-800 border-slate-700">
//                       <SelectItem value="sq ft" className="text-white">sq ft</SelectItem>
//                       <SelectItem value="sq m" className="text-white">sq m</SelectItem>
//                       <SelectItem value="acres" className="text-white">acres</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             </div>
//             <div>
//               <Label className="text-slate-300">Description</Label>
//               <Textarea
//                 name="description"
//                 placeholder="Describe the property features, unique selling points, and key amenities..."
//                 value={propertyData.description}
//                 onChange={handleChange}
//                 rows={4}
//                 className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
//               />
//             </div>
//           </TabsContent>

//           <TabsContent value="analytics" className="space-y-4 mt-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <Label className="text-slate-300">Investment Potential (%)</Label>
//                 <Slider
//                   value={[propertyData.analytics.investmentPotential]}
//                   onValueChange={(value) =>
//                     handleNestedChange("analytics", "investmentPotential", value[0])
//                   }
//                   max={100}
//                   step={1}
//                 />
//                 <div className="text-sm text-slate-400 mt-1">
//                   {propertyData.analytics.investmentPotential}%
//                 </div>
//               </div>
//               <div>
//                 <Label className="text-slate-300">Risk Score (%)</Label>
//                 <Slider
//                   value={[propertyData.analytics.riskScore]}
//                   onValueChange={(value) => handleNestedChange("analytics", "riskScore", value[0])}
//                   max={100}
//                   step={1}
//                 />
//                 <div className="text-sm text-slate-400 mt-1">{propertyData.analytics.riskScore}%</div>
//               </div>
//               <div>
//                 <Label className="text-slate-300">Rental Yield (%)</Label>
//                 <Input
//                   type="number"
//                   value={propertyData.analytics.rentalYield}
//                   onChange={(e) =>
//                     handleNestedChange("analytics", "rentalYield", parseFloat(e.target.value) || 0)
//                   }
//                   className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
//                 />
//               </div>
//               <div>
//                 <Label className="text-slate-300">Appreciation (%)</Label>
//                 <Input
//                   type="number"
//                   value={propertyData.analytics.appreciation}
//                   onChange={(e) =>
//                     handleNestedChange("analytics", "appreciation", parseFloat(e.target.value) || 0)
//                   }
//                   className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
//                 />
//               </div>
//               <div>
//                 <Label className="text-slate-300">Demand Score (%)</Label>
//                 <Input
//                   type="number"
//                   value={propertyData.analytics.demandScore}
//                   onChange={(e) =>
//                     handleNestedChange("analytics", "demandScore", parseFloat(e.target.value) || 0)
//                   }
//                   className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
//                 />
//               </div>
//               <div>
//                 <Label className="text-slate-300">Market Value</Label>
//                 <Input
//                   type="number"
//                   value={propertyData.analytics.marketValue}
//                   onChange={(e) =>
//                     handleNestedChange("analytics", "marketValue", parseFloat(e.target.value) || 0)
//                   }
//                   className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
//                 />
//               </div>
//             </div>
//           </TabsContent>

//           <TabsContent value="risks" className="space-y-4 mt-4">
//             <div className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <Label className="text-slate-300">Risk Hazards</Label>
//                 <Button variant="outline" size="sm" onClick={addHazard} className="border-slate-600 text-slate-300 hover:bg-slate-800">
//                   <Plus size={14} className="mr-1" />
//                   Add Hazard
//                 </Button>
//               </div>
//               {propertyData.hazards.map((hazard, index) => (
//                 <div key={index} className="grid grid-cols-3 gap-2 p-3 border border-slate-700 rounded-lg bg-slate-800/40">
//                   <Select
//                     value={hazard.type}
//                     onValueChange={(value) => updateHazard(index, "type", value)}
//                   >
//                     <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent className="bg-slate-800 border-slate-700">
//                       {hazardTypes.map((type) => (
//                         <SelectItem key={type} value={type} className="text-white">
//                           {type}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <Select
//                     value={hazard.level}
//                     onValueChange={(value) => updateHazard(index, "level", value)}
//                   >
//                     <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent className="bg-slate-800 border-slate-700">
//                       {hazardLevels.map((level) => (
//                         <SelectItem key={level} value={level} className="text-white">
//                           {level.replace("_", " ")}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <div className="flex gap-2">
//                     <Input
//                       placeholder="Description"
//                       value={hazard.description}
//                       onChange={(e) => updateHazard(index, "description", e.target.value)}
//                       className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
//                     />
//                     <Button variant="outline" size="sm" onClick={() => removeHazard(index)} className="border-slate-600 text-red-400 hover:bg-slate-800 hover:text-red-300">
//                       <X size={14} />
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </TabsContent>

//           <TabsContent value="amenities" className="space-y-4 mt-4">
//             {Object.entries(amenityOptions).map(([category, options]) => (
//               <div key={category}>
//                 <Label className="text-slate-300 capitalize">{category.replace("_", " ")}</Label>
//                 <div className="flex flex-wrap gap-2 mt-2">
//                   {options.map((option) => (
//                     <Badge
//                       key={option}
//                       variant={propertyData.amenities[category].includes(option) ? "default" : "outline"}
//                       className={`cursor-pointer ${propertyData.amenities[category].includes(option) ? "bg-blue-600 text-white" : "bg-transparent border border-slate-600 text-slate-300 hover:bg-slate-800"}`}
//                       onClick={() => toggleAmenity(category, option)}
//                     >
//                       {option.replace("_", " ")}
//                     </Badge>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </TabsContent>
//         </Tabs>

//         <DialogFooter className="mt-6">
//           <Button variant="outline" onClick={onClose} className="border-slate-600 text-black hover:bg-slate-800 hover:text-white">
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
//             <Save size={16} className="mr-2" />
//             {mode === "add" ? "Add Property" : "Update Property"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default PropertyFormModal;


import React, { useState, useEffect } from "react";
import {
  Plus, X, Save, Upload, Image as ImageIcon, Building2, TrendingUp, 
  AlertTriangle, Sparkles, Home, DollarSign, Calendar, MapPin
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const defaultProperty = {
  title: "",
  price: "",
  location: "",
  address: "",
  bedrooms: "",
  bathrooms: "",
  area: "",
  areaUnit: "sq ft",
  status: "available",
  type: "single_family",
  yearBuilt: new Date().getFullYear(),
  images: [],
  description: "",
  leads: 0,
  views: 0,
  favorite: false,
  createdAt: new Date().toISOString().split("T")[0],
  analytics: {
    riskScore: 0,
    investmentPotential: 0,
    rentalYield: 0,
    appreciation: 0,
    demandScore: 0,
    marketValue: 0,
    pricePerSqFt: 0
  },
  hazards: [],
  demographics: {
    averageAge: 0,
    averageIncome: "",
    familyRatio: 0,
    education: "",
    populationDensity: "medium"
  },
  amenities: {
    transit: [],
    education: [],
    shopping: [],
    parks: [],
    healthcare: [],
    other: []
  },
  marketInsights: {
    daysOnMarket: 0,
    pricePerSqFt: 0,
    comparableSales: 0,
    marketTrend: "stable",
    avgDaysOnMarket: 0
  },
  financials: {
    monthlyRent: 0,
    propertyTax: 0,
    insurance: 0,
    maintenance: 0,
    hoa: 0
  },
  ownerInfo: {
    name: "",
    email: "",
    phone: "",
    since: new Date().toISOString().split("T")[0]
  }
};

const PropertyFormModal = ({
  isOpen,
  onClose,
  mode,
  initialData,
  onSave,
  isSubmitting = false,
  uploadProgress = 0,
}) => {
  const [propertyData, setPropertyData] = useState(defaultProperty);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);

  useEffect(() => {
    if (initialData && mode === "edit") {
      // Convert object hazards to array if needed
      const hazardsArray = Array.isArray(initialData.hazards) 
        ? initialData.hazards 
        : initialData.hazards && typeof initialData.hazards === 'object'
        ? Object.values(initialData.hazards)
        : [];
      
      setPropertyData({
        ...defaultProperty, // Start with default structure
        // Place specific overrides *after* initialData to ensure they take precedence
        ...initialData,
        hazards: hazardsArray, // Explicitly check if array and convert if needed
        images: Array.isArray(initialData.images) ? initialData.images : [],     // Explicitly check if array
        amenities: {
          ...defaultProperty.amenities,
          ...initialData.amenities,
          transit: Array.isArray(initialData.amenities?.transit) ? initialData.amenities.transit : [],
          education: Array.isArray(initialData.amenities?.education) ? initialData.amenities.education : [],
          shopping: Array.isArray(initialData.amenities?.shopping) ? initialData.amenities.shopping : [],
          parks: Array.isArray(initialData.amenities?.parks) ? initialData.amenities.parks : [],
          healthcare: Array.isArray(initialData.amenities?.healthcare) ? initialData.amenities.healthcare : [],
          other: Array.isArray(initialData.amenities?.other) ? initialData.amenities.other : [],
        }
      });
      setPreviews(initialData.images || []);
    } else {
      setPropertyData(defaultProperty);
      setPreviews([]);
    }
    setFiles([]);
    setDeletedImages([]);
  }, [initialData, isOpen, mode]);

  const handleChange = (e) => {
    setPropertyData({ ...propertyData, [e.target.name]: e.target.value });
  };

  const handleNestedChange = (section, key, value) => {
    setPropertyData({
      ...propertyData,
      [section]: { ...propertyData[section], [key]: value },
    });
  };

  const addHazard = () => {
    setPropertyData({
      ...propertyData,
      hazards: [...(propertyData.hazards || []), { type: "flood", level: "low", description: "" }],
    });
  };

  const removeHazard = (index) => {
    setPropertyData({
      ...propertyData,
      hazards: (propertyData.hazards || []).filter((_, i) => i !== index),
    });
  };

  const updateHazard = (index, key, value) => {
    const updatedHazards = [...(propertyData.hazards || [])];
    updatedHazards[index][key] = value;
    setPropertyData({ ...propertyData, hazards: updatedHazards });
  };

  const toggleAmenity = (category, item) => {
    const updatedAmenities = { ...propertyData.amenities };
    if (updatedAmenities[category].includes(item)) {
      updatedAmenities[category] = updatedAmenities[category].filter((i) => i !== item);
    } else {
      updatedAmenities[category].push(item);
    }
    setPropertyData({ ...propertyData, amenities: updatedAmenities });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    const newFiles = selectedFiles.filter((file): file is File => file instanceof File);
    setFiles([...files, ...newFiles]);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index) => {
    if (index < (propertyData.images || []).length) {
      setDeletedImages([...deletedImages, propertyData.images[index]]);
      setPropertyData({
        ...propertyData,
        images: (propertyData.images || []).filter((_, i) => i !== index),
      });
    } else {
      const fileIndex = index - (propertyData.images || []).length;
      setFiles(files.filter((_, i) => i !== fileIndex));
    }
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (isSubmitting) return;
    onSave(propertyData, files, deletedImages);
  };

  const propertyTypes = [
    { value: "single_family", label: "Single Family Home" },
    { value: "condo", label: "Condominium" },
    { value: "townhouse", label: "Townhouse" },
    { value: "multi_family", label: "Multi-Family" },
    { value: "commercial", label: "Commercial" },
    { value: "land", label: "Land" },
  ];

  const hazardTypes = [
    { value: "flood", label: "Flood", color: "bg-blue-500" },
    { value: "earthquake", label: "Earthquake", color: "bg-amber-600" },
    { value: "fire", label: "Fire", color: "bg-red-500" },
    { value: "landslide", label: "Landslide", color: "bg-orange-600" },
    { value: "hurricane", label: "Hurricane", color: "bg-cyan-600" },
    { value: "tornado", label: "Tornado", color: "bg-purple-600" },
  ];

  const hazardLevels = [
    { value: "very_low", label: "Very Low" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "very_high", label: "Very High" },
  ];

  const amenityOptions = {
    transit: [
      { value: "subway", label: "Subway" },
      { value: "bus", label: "Bus Stop" },
      { value: "train", label: "Train Station" },
      { value: "light_rail", label: "Light Rail" },
      { value: "airport", label: "Airport Nearby" },
    ],
    education: [
      { value: "top_schools", label: "Top-Rated Schools" },
      { value: "good_schools", label: "Good Schools" },
      { value: "universities", label: "Universities" },
      { value: "colleges", label: "Colleges" },
    ],
    shopping: [
      { value: "luxury_malls", label: "Luxury Shopping" },
      { value: "local_malls", label: "Shopping Centers" },
      { value: "grocery", label: "Grocery Stores" },
      { value: "boutiques", label: "Boutiques" },
    ],
    parks: [
      { value: "community_parks", label: "Parks" },
      { value: "nature_preserve", label: "Nature Preserve" },
      { value: "playgrounds", label: "Playgrounds" },
      { value: "riverside_park", label: "Riverside" },
    ],
    healthcare: [
      { value: "hospital", label: "Hospital" },
      { value: "clinics", label: "Medical Clinics" },
      { value: "specialty_clinics", label: "Specialty Care" },
      { value: "dentists", label: "Dental Care" },
    ],
    other: [
      { value: "gym", label: "Fitness Center" },
      { value: "pool", label: "Swimming Pool" },
      { value: "concierge", label: "Concierge" },
      { value: "security", label: "24/7 Security" },
      { value: "garage", label: "Parking Garage" },
      { value: "garden", label: "Garden" },
    ],
  };

  const MetricCard = ({ label, value, max = 100, color = "blue" }) => {
    const percentage = (value / max) * 100;
    const colorClasses = {
      blue: "bg-blue-500",
      orange: "bg-orange-500",
      purple: "bg-purple-500",
      green: "bg-emerald-500",
      red: "bg-red-500"
    };

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-baseline">
          <Label className="text-sm font-medium text-slate-300">{label}</Label>
          <span className="text-lg font-semibold text-white">{value}%</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className={`h-full ${colorClasses[color]} transition-all duration-500 rounded-full`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white border-gray-500 shadow-2xl p-2" style={{ maxWidth: "min(1024px, calc(100vw - 24px))", maxHeight: "min(92vh, calc(100vh - 24px))" }}>
        {/* Header Section */}
        <div className="border-b border-slate-800/50 bg-gradient-to-r from-slate-900/50 to-transparent" style={{ padding: "clamp(18px, 2.4vw, 32px) clamp(18px, 2.4vw, 32px) clamp(14px, 2vw, 24px)" }}>
          <DialogHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5 min-w-0">
                <DialogTitle className="font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent" style={{ fontSize: "clamp(1.25rem, 2.2vw, 1.85rem)" }}>
                  {mode === "add" ? "Add New Property" : "Edit Property"}
                </DialogTitle>
                <DialogDescription className="text-slate-400" style={{ fontSize: "clamp(0.85rem, 1.05vw, 1rem)" }}>
                  {mode === "add"
                    ? "Create a comprehensive property listing with analytics and insights"
                    : "Update property information and market data"}
                </DialogDescription>
              </div>
              <div className="flex gap-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="basic" className="w-full">
          <div className="px-4 sm:px-8 pt-6">
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 h-auto gap-1 bg-slate-900/50 p-1.5 rounded-xl border border-slate-800/50 backdrop-blur-sm">
              <TabsTrigger 
                value="basic" 
                className="rounded-lg text-xs sm:text-sm font-medium text-slate-400 transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25"
              >
                <Home className="w-4 h-4 mr-2" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger 
                value="details" 
                className="rounded-lg text-xs sm:text-sm font-medium text-slate-400 transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25"
              >
                <Building2 className="w-4 h-4 mr-2" />
                Details
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="rounded-lg text-xs sm:text-sm font-medium text-slate-400 transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="risks" 
                className="rounded-lg text-xs sm:text-sm font-medium text-slate-400 transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Risk
              </TabsTrigger>
              <TabsTrigger 
                value="amenities" 
                className="rounded-lg text-xs sm:text-sm font-medium text-slate-400 transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Amenities
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content Area with Scroll */}
          <div className="px-4 sm:px-8 pb-6 overflow-y-auto" style={{ maxHeight: "calc(92vh - 280px)" }}>
            <TabsContent value="basic" className="space-y-6 mt-6">
              {/* Property Title and Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-400" />
                    Property Title <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    name="title"
                    placeholder="e.g., Luxury Downtown Penthouse"
                    value={propertyData.title}
                    onChange={handleChange}
                    className="bg-slate-900/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all h-12 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    Price <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    name="price"
                    placeholder="e.g., ₹55,00,000"
                    value={propertyData.price}
                    onChange={handleChange}
                    className="bg-slate-900/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all h-12 rounded-lg"
                  />
                </div>
              </div>

              {/* Location and Address */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-400" />
                    Location <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    name="location"
                    placeholder="e.g., Downtown Financial District"
                    value={propertyData.location}
                    onChange={handleChange}
                    className="bg-slate-900/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all h-12 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-300">Full Address</Label>
                  <Input
                    name="address"
                    placeholder="e.g., 123 Skyline Boulevard, New York, NY 10001"
                    value={propertyData.address}
                    onChange={handleChange}
                    className="bg-slate-900/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all h-12 rounded-lg"
                  />
                </div>
              </div>

              {/* Property Type and Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-300">Property Type</Label>
                  <Select
                    value={propertyData.type}
                    onValueChange={(value) => setPropertyData({ ...propertyData, type: value })}
                  >
                    <SelectTrigger className="bg-slate-900/50 border-slate-700/50 text-white h-12 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      {propertyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value} className="text-white hover:bg-slate-800">
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-300">Status</Label>
                  <Select
                    value={propertyData.status}
                    onValueChange={(value) => setPropertyData({ ...propertyData, status: value })}
                  >
                    <SelectTrigger className="bg-slate-900/50 border-slate-700/50 text-white h-12 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      <SelectItem value="available" className="text-white hover:bg-slate-800">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          Available
                        </span>
                      </SelectItem>
                      <SelectItem value="pending" className="text-white hover:bg-slate-800">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                          Pending
                        </span>
                      </SelectItem>
                      <SelectItem value="sold" className="text-white hover:bg-slate-800">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          Sold
                        </span>
                      </SelectItem>
                      <SelectItem value="draft" className="text-white hover:bg-slate-800">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                          Draft
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Images Upload */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-pink-400" />
                  Property Images
                </Label>
                <div className="relative">
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                    disabled={isSubmitting}
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-700 rounded-xl bg-slate-900/30 hover:bg-slate-900/50 cursor-pointer transition-all group"
                  >
                    <Upload className="w-8 h-8 text-slate-500 group-hover:text-blue-400 transition-colors mb-2" />
                    <p className="text-sm text-slate-400 group-hover:text-slate-300">
                      <span className="font-medium text-blue-400">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-slate-500 mt-1">PNG, JPG, WebP up to 10MB</p>
                  </label>
                </div>
                {previews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                    {previews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-28 object-cover rounded-lg border border-slate-700"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                        >
                          <X size={14} />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-md font-medium">
                            Cover
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-6 mt-6">
              {/* Property Specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-300">Bedrooms</Label>
                  <Input
                    type="number"
                    name="bedrooms"
                    placeholder="3"
                    value={propertyData.bedrooms}
                    onChange={handleChange}
                    className="bg-slate-900/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all h-12 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-300">Bathrooms</Label>
                  <Input
                    type="number"
                    name="bathrooms"
                    placeholder="2"
                    value={propertyData.bathrooms}
                    onChange={handleChange}
                    className="bg-slate-900/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all h-12 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    Year Built
                  </Label>
                  <Input
                    type="number"
                    name="yearBuilt"
                    placeholder="2020"
                    value={propertyData.yearBuilt}
                    onChange={handleChange}
                    className="bg-slate-900/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all h-12 rounded-lg"
                  />
                </div>
              </div>

              {/* Area */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-300">Total Area</Label>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Input
                    name="area"
                    placeholder="2400"
                    value={propertyData.area}
                    onChange={handleChange}
                    className="flex-1 bg-slate-900/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all h-12 rounded-lg"
                  />
                  <Select
                    value={propertyData.areaUnit}
                    onValueChange={(value) => setPropertyData({ ...propertyData, areaUnit: value })}
                  >
                    <SelectTrigger className="w-full sm:w-32 bg-slate-900/50 border-slate-700/50 text-white h-12 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      <SelectItem value="sq ft" className="text-white">sq ft</SelectItem>
                      <SelectItem value="sq m" className="text-white">sq m</SelectItem>
                      <SelectItem value="acres" className="text-white">acres</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-300">Property Description</Label>
                <Textarea
                  name="description"
                  placeholder="Describe the property's unique features, amenities, location benefits, and what makes it special..."
                  value={propertyData.description}
                  onChange={handleChange}
                  rows={6}
                  className="bg-slate-900/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all rounded-lg resize-none"
                />
                <p className="text-xs text-slate-500 mt-1">
                  {propertyData.description.length} / 500 characters
                </p>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6 mt-6">
              {/* Analytics Header */}
              <div className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  Investment Analytics
                </h3>
                <p className="text-sm text-slate-400">Configure AI-powered market intelligence and performance metrics</p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3">
                  <MetricCard 
                    label="Investment Potential" 
                    value={propertyData.analytics.investmentPotential}
                    color="blue"
                  />
                  <Slider
                    value={[propertyData.analytics.investmentPotential]}
                    onValueChange={(value) =>
                      handleNestedChange("analytics", "investmentPotential", value[0])
                    }
                    max={100}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div className="space-y-3">
                  <MetricCard 
                    label="Risk Score" 
                    value={propertyData.analytics.riskScore}
                    color="orange"
                  />
                  <Slider
                    value={[propertyData.analytics.riskScore]}
                    onValueChange={(value) => handleNestedChange("analytics", "riskScore", value[0])}
                    max={100}
                    step={1}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Financial Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-300">Rental Yield (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={propertyData.analytics.rentalYield}
                    onChange={(e) =>
                      handleNestedChange("analytics", "rentalYield", parseFloat(e.target.value) || 0)
                    }
                    className="bg-slate-900/50 border-slate-700/50 text-white h-12 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-300">Expected Appreciation (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={propertyData.analytics.appreciation}
                    onChange={(e) =>
                      handleNestedChange("analytics", "appreciation", parseFloat(e.target.value) || 0)
                    }
                    className="bg-slate-900/50 border-slate-700/50 text-white h-12 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-300">Market Demand Score</Label>
                  <Input
                    type="number"
                    value={propertyData.analytics.demandScore}
                    onChange={(e) =>
                      handleNestedChange("analytics", "demandScore", parseFloat(e.target.value) || 0)
                    }
                    className="bg-slate-900/50 border-slate-700/50 text-white h-12 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-300">Estimated Market Value</Label>
                  <Input
                    type="number"
                    value={propertyData.analytics.marketValue}
                    onChange={(e) =>
                      handleNestedChange("analytics", "marketValue", parseFloat(e.target.value) || 0)
                    }
                    placeholder="₹65,00,000"
                    className="bg-slate-900/50 border-slate-700/50 text-white h-12 rounded-lg"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="risks" className="space-y-6 mt-6">
              {/* Risk Assessment Header */}
              <div className="p-6 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                  Environmental & Safety Risks
                </h3>
                <p className="text-sm text-slate-400">Identify and assess potential hazards affecting the property</p>
              </div>

              {/* Add Hazard Button */}
              <Button
                variant="outline"
                onClick={addHazard}
                className="w-full border-slate-700 hover:bg-slate-800 text-blue-900 h-12 rounded-lg "
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Risk Hazard
              </Button>

              {/* Hazards List */}
              {(() => {
                const hazardsArray = Array.isArray(propertyData.hazards) ? propertyData.hazards : [];
                return hazardsArray.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                    <AlertTriangle className="w-8 h-8 text-slate-600" />
                  </div>
                  <p className="text-slate-400 text-sm">No risk hazards added yet</p>
                  <p className="text-slate-500 text-xs mt-1">Click the button above to add environmental risks</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {hazardsArray.map((hazard, index) => (
                    <div
                      key={index}
                      className="p-5 border border-slate-700/50 rounded-xl bg-slate-900/30 hover:bg-slate-900/50 transition-all"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4">
                        <div className="sm:col-span-4 space-y-2">
                          <Label className="text-xs font-medium text-slate-400">Hazard Type</Label>
                          <Select
                            value={hazard.type}
                            onValueChange={(value) => updateHazard(index, "type", value)}
                          >
                            <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-11 rounded-lg">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700">
                              {hazardTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value} className="text-white">
                                  <span className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${type.color}`}></span>
                                    {type.label}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="sm:col-span-3 space-y-2">
                          <Label className="text-xs font-medium text-slate-400">Risk Level</Label>
                          <Select
                            value={hazard.level}
                            onValueChange={(value) => updateHazard(index, "level", value)}
                          >
                            <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-11 rounded-lg">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700">
                              {hazardLevels.map((level) => (
                                <SelectItem key={level.value} value={level.value} className="text-white">
                                  {level.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="sm:col-span-4 space-y-2">
                          <Label className="text-xs font-medium text-slate-400">Description</Label>
                          <Input
                            placeholder="Additional details..."
                            value={hazard.description}
                            onChange={(e) => updateHazard(index, "description", e.target.value)}
                            className="bg-slate-800 border-slate-700 text-white h-11 rounded-lg"
                          />
                        </div>
                        <div className="sm:col-span-1 flex items-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeHazard(index)}
                            className="w-full h-11 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  </div>
                );
              })()}
            </TabsContent>

            <TabsContent value="amenities" className="space-y-6 mt-6">
              {/* Amenities Header */}
              <div className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Property Amenities & Features
                </h3>
                <p className="text-sm text-slate-400">Select all available amenities and nearby facilities</p>
              </div>

              {/* Amenity Categories */}
              <div className="space-y-6">
                {Object.entries(amenityOptions).map(([category, options]) => (
                  <div key={category} className="space-y-3">
                    <Label className="text-sm font-medium text-slate-300 capitalize flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                      {category.replace("_", " ")}
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {options.map((option) => {
                        const isSelected = (propertyData.amenities[category] || []).includes(option.value);
                        return (
                          <button
                            key={option.value}
                            onClick={() => toggleAmenity(category, option.value)}
                            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                              isSelected
                                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
                                : "bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600"
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Footer Actions */}
        <div className="px-6 bg-gradient-to-r from-slate-900/50 to-transparent">
          {isSubmitting ? (
            <div className="mb-3 text-xs text-slate-300">
              Uploading... {uploadProgress}%
            </div>
          ) : null}
          {isSubmitting ? (
            <div className="mb-4 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          ) : null}
          <DialogFooter className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white h-12 px-6 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white h-12 px-8 rounded-lg shadow-lg shadow-blue-500/25"
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  {mode === "add" ? "Creating..." : "Saving..."}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {mode === "add" ? "Create Property" : "Save Changes"}
                </>
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyFormModal;
