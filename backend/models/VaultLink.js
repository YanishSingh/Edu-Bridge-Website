import mongoose from 'mongoose';

const vaultLinkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    url: { type: String, required: true, trim: true, maxlength: 2000 },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  },
  { timestamps: true }
);

const VaultLink = mongoose.model('VaultLink', vaultLinkSchema);
export default VaultLink;
