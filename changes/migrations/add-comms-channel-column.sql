-- Add comms_channel column to contact_messages table
-- This column captures which communication channel a user selected (Discord, Slack, or NULL for regular feedback)

ALTER TABLE contact_messages 
ADD COLUMN comms_channel VARCHAR(50) DEFAULT NULL;

-- Add comment to explain the column
COMMENT ON COLUMN contact_messages.comms_channel IS 'Communication channel selected by user: discord, slack, or NULL for regular feedback';

-- Index for potential filtering by comms_channel
CREATE INDEX idx_contact_messages_comms_channel ON contact_messages(comms_channel);
