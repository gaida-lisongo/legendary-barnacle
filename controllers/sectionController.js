const Section = require('../models/Section');

class SectionController {
    
    // Créer une nouvelle section
    async createSection(sectionData) {
        try {
            const newSection = new Section(sectionData);
            const savedSection = await newSection.save();
            
            return {
                success: true,
                message: 'Section créée avec succès',
                data: savedSection
            };
        } catch (error) {
            if (error.code === 11000) {
                return {
                    success: false,
                    message: 'Le sigle de la section existe déjà',
                    error: error.message
                };
            }
            
            return {
                success: false,
                message: 'Erreur lors de la création de la section',
                error: error.message
            };
        }
    }

    // Lire toutes les sections
    async getAllSections() {
        try {
            const sections = await Section.find();
            
            return {
                success: true,
                message: 'Sections récupérées avec succès',
                count: sections.length,
                data: sections
            };
        } catch (error) {
            return {
                success: false,
                message: 'Erreur lors de la récupération des sections',
                error: error.message
            };
        }
    }

    // Lire une section par ID
    async getSectionById(id) {
        try {
            const section = await Section.findById(id);
            
            if (!section) {
                return {
                    success: false,
                    message: 'Section non trouvée'
                };
            }
            
            return {
                success: true,
                message: 'Section récupérée avec succès',
                data: section
            };
        } catch (error) {
            return {
                success: false,
                message: 'Erreur lors de la récupération de la section',
                error: error.message
            };
        }
    }

    // Lire une section par nom (sigle ou designation)
    async getSectionByName(name) {
        try {
            // Recherche par sigle ou designation
            const section = await Section.findOne({
                $or: [
                    { 'description.sigle': { $regex: name, $options: 'i' } },
                    { 'description.designation': { $regex: name, $options: 'i' } }
                ]
            });
            
            if (!section) {
                return {
                    success: false,
                    message: 'Section non trouvée avec ce nom'
                };
            }
            
            return {
                success: true,
                message: 'Section récupérée avec succès',
                data: section
            };
        } catch (error) {
            return {
                success: false,
                message: 'Erreur lors de la recherche de la section',
                error: error.message
            };
        }
    }

    // Modifier une section
    async updateSection(id, updateData) {
        try {
            const updatedSection = await Section.findByIdAndUpdate(
                id,
                updateData,
                { 
                    new: true,
                    runValidators: true
                }
            );
            
            if (!updatedSection) {
                return {
                    success: false,
                    message: 'Section non trouvée'
                };
            }
            
            return {
                success: true,
                message: 'Section mise à jour avec succès',
                data: updatedSection
            };
        } catch (error) {
            if (error.code === 11000) {
                return {
                    success: false,
                    message: 'Le sigle de la section existe déjà',
                    error: error.message
                };
            }
            
            return {
                success: false,
                message: 'Erreur lors de la mise à jour de la section',
                error: error.message
            };
        }
    }

    // Supprimer une section
    async deleteSection(id) {
        try {
            const deletedSection = await Section.findByIdAndDelete(id);
            
            if (!deletedSection) {
                return {
                    success: false,
                    message: 'Section non trouvée'
                };
            }
            
            return {
                success: true,
                message: 'Section supprimée avec succès',
                data: deletedSection
            };
        } catch (error) {
            return {
                success: false,
                message: 'Erreur lors de la suppression de la section',
                error: error.message
            };
        }
    }

    // Rechercher des sections avec pagination
    async searchSections(searchOptions = {}) {
        try {
            const { page = 1, limit = 10, search = '' } = searchOptions;
            const skip = (page - 1) * limit;
            
            const query = search ? {
                $or: [
                    { 'description.sigle': { $regex: search, $options: 'i' } },
                    { 'description.designation': { $regex: search, $options: 'i' } },
                    { 'description.devise': { $regex: search, $options: 'i' } }
                ]
            } : {};
            
            const sections = await Section.find(query)
                .skip(skip)
                .limit(parseInt(limit))
                .sort({ createdAt: -1 });
                
            const total = await Section.countDocuments(query);
            
            return {
                success: true,
                message: 'Recherche effectuée avec succès',
                data: sections,
                pagination: {
                    current: parseInt(page),
                    pages: Math.ceil(total / limit),
                    total
                }
            };
        } catch (error) {
            return {
                success: false,
                message: 'Erreur lors de la recherche',
                error: error.message
            };
        }
    }
}

module.exports = new SectionController();