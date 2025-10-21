// app/games/page.tsx
"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Badge } from "~/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Image as ImageIcon,
  Package,
  ArrowLeft,
  Grid3X3,
  List,
  DollarSign,
  Tag,
  Filter,
  Gamepad2,
  Upload,
  X,
} from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";

type Game = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
};

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([
    {
      id: "1",
      name: "Cyberpunk 2077",
      description: "Open-world action adventure RPG",
      category: "RPG",
      price: 59.99,
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop"
    },
    {
      id: "2",
      name: "Call of Duty",
      description: "First-person shooter game",
      category: "FPS",
      price: 69.99,
      image: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=400&h=400&fit=crop"
    },
    {
      id: "3",
      name: "FIFA 24",
      description: "Football simulation game",
      category: "Sports",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=400&h=400&fit=crop"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { user } = useUser();

  const categories = ["all", ...new Set(games.map(game => game.category))];

  const filteredGames = games.filter(game =>
    (game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedCategory === "all" || game.category === selectedCategory)
  );

  const handleDelete = (id: string) => {
    setGames(games.filter(game => game.id !== id));
  };

  const handleSave = (gameData: Omit<Game, "id">) => {
    if (editingGame) {
      setGames(games.map(game => game.id === editingGame.id ? { ...gameData, id: editingGame.id } : game));
      setEditingGame(null);
    } else {
      setGames([...games, { ...gameData, id: Date.now().toString() }]);
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B2838] via-[#2A475E] to-[#3C5A78] text-white font-sans">
      {/* Header */}
      <div className="border-b border-[#4C6B8A] bg-[#171D25]">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="flex items-center gap-3 border-[#66C0F4] bg-[#66C0F4]/10 text-[#66C0F4] hover:bg-[#66C0F4]/20 hover:text-white transition-all duration-300"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Back to Dashboard
                </Button>
              </Link>
              
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-gradient-to-br from-[#66C0F4] to-[#4B9CD3] p-3 shadow-md">
                  <Gamepad2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-[#66C0F4] to-[#90BA3C] bg-clip-text text-transparent">
                    GAMEVAULT
                  </h1>
                  <p className="text-sm text-[#8F98A0]">Game Management System</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="rounded-full border-2 border-[#66C0F4]/50 bg-[#1B2838] p-1">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-10 w-10",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-[#66C0F4]/10 to-[#4B9CD3]/10 border-[#66C0F4]/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#66C0F4] font-semibold">Total Games</p>
                  <p className="text-3xl font-bold text-white mt-2">{games.length}</p>
                </div>
                <div className="p-3 bg-[#66C0F4]/20 rounded-2xl">
                  <Package className="h-6 w-6 text-[#66C0F4]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#90BA3C]/10 to-[#7AA32A]/10 border-[#90BA3C]/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#90BA3C] font-semibold">Categories</p>
                  <p className="text-3xl font-bold text-white mt-2">{categories.length - 1}</p>
                </div>
                <div className="p-3 bg-[#90BA3C]/20 rounded-2xl">
                  <Tag className="h-6 w-6 text-[#90BA3C]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#FF6B35]/10 to-[#E5532D]/10 border-[#FF6B35]/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#FF6B35] font-semibold">Total Value</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    ${games.reduce((sum, game) => sum + game.price, 0).toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-[#FF6B35]/20 rounded-2xl">
                  <DollarSign className="h-6 w-6 text-[#FF6B35]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#8B5CF6]/10 to-[#7C3AED]/10 border-[#8B5CF6]/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#8B5CF6] font-semibold">Filtered</p>
                  <p className="text-3xl font-bold text-white mt-2">{filteredGames.length}</p>
                </div>
                <div className="p-3 bg-[#8B5CF6]/20 rounded-2xl">
                  <Filter className="h-6 w-6 text-[#8B5CF6]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls Bar */}
        <Card className="border-[#4C6B8A] bg-[#1B2838] shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
              {/* Search */}
              <div className="flex-1 w-full lg:max-w-md">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#8F98A0] h-4 w-4" />
                  <Input
                    placeholder="Search games by name or category..."
                    className="pl-12 bg-[#171D25] border-[#4C6B8A] text-white placeholder-[#8F98A0] h-12 rounded-xl focus:ring-2 focus:ring-[#66C0F4]/50 focus:border-[#66C0F4]/50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Filters and View Controls */}
              <div className="flex flex-wrap gap-4 items-center">
                {/* Category Filter */}
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-[#171D25] border border-[#4C6B8A] text-white rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#66C0F4]/50 focus:border-[#66C0F4]/50"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>

                {/* View Toggle */}
                <div className="flex bg-[#171D25] rounded-xl p-1 border border-[#4C6B8A]">
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={`rounded-lg ${viewMode === "list" ? "bg-[#66C0F4]/20 text-[#66C0F4]" : "text-[#8F98A0] hover:text-white"}`}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={`rounded-lg ${viewMode === "grid" ? "bg-[#66C0F4]/20 text-[#66C0F4]" : "text-[#8F98A0] hover:text-white"}`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Add Game Button */}
                <Button
                  onClick={() => setIsCreating(true)}
                  className="bg-gradient-to-r from-[#66C0F4] to-[#4B9CD3] text-white hover:from-[#66C0F4] hover:to-[#4B9CD3] h-12 px-6 rounded-xl font-semibold shadow-lg shadow-[#66C0F4]/25 hover:shadow-[#66C0F4]/40 transition-all duration-300"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Game
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Games Display */}
        {viewMode === "list" ? (
          <Card className="border-[#4C6B8A] bg-[#1B2838] shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-[#66C0F4] flex items-center gap-3 text-xl">
                <div className="p-2 bg-[#66C0F4]/20 rounded-xl">
                  <Package className="h-5 w-5" />
                </div>
                Games Library
                <Badge className="bg-[#66C0F4]/20 text-[#66C0F4] border-[#66C0F4]/30 ml-2">
                  {filteredGames.length} games
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border border-[#4C6B8A] rounded-xl overflow-hidden">
                <Table>
                  <TableHeader className="bg-[#171D25]">
                    <TableRow className="border-b border-[#4C6B8A] hover:bg-transparent">
                      <TableHead className="text-[#66C0F4] font-semibold py-4">Game</TableHead>
                      <TableHead className="text-[#66C0F4] font-semibold">Description</TableHead>
                      <TableHead className="text-[#66C0F4] font-semibold">Category</TableHead>
                      <TableHead className="text-[#66C0F4] font-semibold">Price</TableHead>
                      <TableHead className="text-[#66C0F4] font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGames.map((game) => (
                      <TableRow key={game.id} className="border-b border-[#4C6B8A] hover:bg-[#171D25] transition-colors">
                        <TableCell className="py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-[#171D25] rounded-xl overflow-hidden flex items-center justify-center">
                              {game.image ? (
                                <img 
                                  src={game.image} 
                                  alt={game.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <ImageIcon className="h-6 w-6 text-[#8F98A0]" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-white">{game.name}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-[#C7D5E0] max-w-xs">
                          <p className="line-clamp-2">{game.description}</p>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-[#90BA3C]/20 text-[#90BA3C] border-[#90BA3C]/30 font-medium">
                            {game.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-[#FF6B35]" />
                            <span className="text-[#FF6B35] font-bold text-lg">{game.price.toFixed(2)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-[#66C0F4] text-[#66C0F4] hover:bg-[#66C0F4]/20 hover:text-[#66C0F4] rounded-lg transition-all duration-300"
                              onClick={() => setEditingGame(game)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35]/20 hover:text-[#FF6B35] rounded-lg transition-all duration-300"
                              onClick={() => handleDelete(game.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredGames.map((game) => (
              <Card key={game.id} className="border-[#4C6B8A] bg-[#1B2838] hover:bg-[#171D25] transition-all duration-300 group">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-xl">
                    <div className="h-48 bg-gradient-to-br from-[#171D25] to-[#2A475E] relative overflow-hidden">
                      {game.image ? (
                        <img 
                          src={game.image} 
                          alt={game.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-[#8F98A0]" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1B2838] to-transparent"></div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-[#90BA3C]/20 text-[#90BA3C] border-[#90BA3C]/30">
                        {game.category}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1">{game.name}</h3>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-[#FF6B35]" />
                        <span className="text-[#FF6B35] font-bold text-lg">{game.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-[#C7D5E0] text-sm mb-4 line-clamp-2">{game.description}</p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-[#66C0F4] text-[#66C0F4] hover:bg-[#66C0F4]/20 hover:text-[#66C0F4] rounded-lg transition-all duration-300"
                        onClick={() => setEditingGame(game)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35]/20 hover:text-[#FF6B35] rounded-lg transition-all duration-300"
                        onClick={() => handleDelete(game.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Game Form Modal */}
        {(isCreating || editingGame) && (
          <GameForm
            game={editingGame}
            onSave={handleSave}
            onCancel={() => {
              setIsCreating(false);
              setEditingGame(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

function GameForm({ game, onSave, onCancel }: {
  game: Game | null;
  onSave: (data: Omit<Game, "id">) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: game?.name || "",
    description: game?.description || "",
    category: game?.category || "",
    price: game?.price || 0,
    image: game?.image || ""
  });

  const [imagePreview, setImagePreview] = useState(game?.image || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handlePriceChange = (value: string) => {
    const priceValue = value === '' ? 0 : parseFloat(value) || 0;
    setFormData({ ...formData, price: priceValue });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPEG, PNG, etc.)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Please select an image smaller than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setFormData({ ...formData, image: base64 });
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please drop an image file (JPEG, PNG, etc.)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Please drop an image smaller than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setFormData({ ...formData, image: base64 });
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const removeImage = () => {
    setFormData({ ...formData, image: "" });
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-4xl border-[#4C6B8A] bg-[#1B2838] max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl">
        <CardHeader className="border-b border-[#4C6B8A] pb-6">
          <CardTitle className="text-2xl bg-gradient-to-r from-[#66C0F4] to-[#90BA3C] bg-clip-text text-transparent font-bold">
            {game ? 'Edit Game' : 'Add New Game'}
          </CardTitle>
          <p className="text-[#8F98A0] mt-2">
            {game ? 'Update the game details' : 'Fill in the details to add a new game to your library'}
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-[#66C0F4] mb-2 block">Game Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-[#171D25] border-[#4C6B8A] text-white h-12 rounded-lg focus:ring-2 focus:ring-[#66C0F4]/50 focus:border-[#66C0F4]/50"
                    placeholder="Enter game name"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-[#66C0F4] mb-2 block">Description *</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-[#171D25] border-[#4C6B8A] text-white rounded-lg focus:ring-2 focus:ring-[#66C0F4]/50 focus:border-[#66C0F4]/50 min-h-[120px]"
                    placeholder="Enter game description"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-[#66C0F4] mb-2 block">Category *</label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="bg-[#171D25] border-[#4C6B8A] text-white h-12 rounded-lg focus:ring-2 focus:ring-[#66C0F4]/50 focus:border-[#66C0F4]/50"
                    placeholder="e.g., RPG, FPS, Sports"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-[#66C0F4] mb-2 block">Price ($) *</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#8F98A0] h-4 w-4" />
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price === 0 ? "" : formData.price}
                      onChange={(e) => handlePriceChange(e.target.value)}
                      className="bg-[#171D25] border-[#4C6B8A] text-white h-12 rounded-lg pl-12 focus:ring-2 focus:ring-[#66C0F4]/50 focus:border-[#66C0F4]/50"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Image Upload */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-[#66C0F4] mb-2 block">Game Image</label>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    className="hidden"
                  />

                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={triggerFileInput}
                    className="border-2 border-dashed border-[#4C6B8A] rounded-lg p-6 bg-[#171D25] min-h-[250px] flex flex-col items-center justify-center cursor-pointer hover:border-[#66C0F4] hover:bg-[#1B2838] transition-all duration-300 group"
                  >
                    {imagePreview ? (
                      <div className="text-center relative w-full">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="max-w-full max-h-48 mx-auto rounded-lg mb-4"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage();
                          }}
                          className="absolute -top-2 -right-2 bg-[#FF6B35] rounded-full p-2 hover:bg-[#E5532D] transition-colors"
                        >
                          <X className="h-4 w-4 text-white" />
                        </button>
                        <p className="text-sm text-[#8F98A0]">Click to change image</p>
                      </div>
                    ) : (
                      <div className="text-center text-[#8F98A0] group-hover:text-[#C7D5E0] transition-colors">
                        <div className="p-4 bg-[#66C0F4]/10 rounded-lg mb-4 group-hover:bg-[#66C0F4]/20 transition-colors">
                          <Upload className="h-8 w-8 mx-auto text-[#66C0F4]" />
                        </div>
                        <p className="font-semibold mb-2">Upload Game Image</p>
                        <p className="text-sm mb-1">Click to browse or drag and drop</p>
                        <p className="text-xs text-[#8F98A0]">
                          Supports: JPG, PNG, WebP (Max 5MB)
                        </p>
                      </div>
                    )}
                  </div>

                  {!imagePreview && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={triggerFileInput}
                      className="w-full mt-4 border-[#66C0F4] text-[#66C0F4] hover:bg-[#66C0F4]/20 h-12 rounded-lg font-semibold"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Select Image from Computer
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-[#4C6B8A]">
              <Button 
                type="submit" 
                className="flex-1 bg-gradient-to-r from-[#66C0F4] to-[#4B9CD3] text-white hover:from-[#66C0F4] hover:to-[#4B9CD3] h-12 rounded-lg font-semibold text-lg shadow-lg shadow-[#66C0F4]/25 transition-all duration-300"
                disabled={!formData.name || !formData.description || !formData.category || formData.price <= 0}
              >
                {game ? 'Update Game' : 'Add Game to Library'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel} 
                className="border-[#4C6B8A] text-[#8F98A0] hover:bg-[#2A475E] hover:text-white h-12 rounded-lg font-semibold px-8"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}