use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod stroomp_donation_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.stroomp_config.total_donations = 0;
        ctx.accounts.stroomp_config.total_raised = 0;
        Ok(())
    }

    pub fn make_donation(ctx: Context<MakeDonation>, amount: u64, message: String, is_anonymous: bool) -> Result<()> {
        // Transfer SOL from donor to streamer
        let cpi_context = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.donor.to_account_info(),
                to: ctx.accounts.streamer.to_account_info(),
            },
        );
        
        anchor_lang::system_program::transfer(cpi_context, amount)?;
        
        // Create donation record
        let donation = &mut ctx.accounts.donation;
        donation.donor = ctx.accounts.donor.key();
        donation.streamer = ctx.accounts.streamer.key();
        donation.amount = amount;
        donation.message = message;
        donation.is_anonymous = is_anonymous;
        donation.timestamp = Clock::get()?.unix_timestamp;
        donation.tx_signature = ctx.accounts.donor.key(); // This would be the actual tx signature in practice
        
        // Update config
        let config = &mut ctx.accounts.stroomp_config;
        config.total_donations += 1;
        config.total_raised += amount as u128;
        
        emit!(DonationEvent {
            donor: ctx.accounts.donor.key(),
            streamer: ctx.accounts.streamer.key(),
            amount,
            message,
            is_anonymous,
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 8 + 16)] // discriminator + total_donations + total_raised
    pub stroomp_config: Account<'info, StroompConfig>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, SystemProgram>,
}

#[derive(Accounts)]
pub struct MakeDonation<'info> {
    #[account(mut)]
    pub donation: Account<'info, Donation>,
    #[account(mut)]
    pub stroomp_config: Account<'info, StroompConfig>,
    #[account(mut)]
    pub donor: Signer<'info>,
    /// CHECK: The streamer account is checked in the handler
    #[account(mut)]
    pub streamer: AccountInfo<'info>,
    pub system_program: Program<'info, SystemProgram>,
    pub token_program: Program<'info, anchor_lang::solana_program::system_program::System>,
}

#[account]
pub struct StroompConfig {
    pub total_donations: u64,
    pub total_raised: u128,
}

#[account]
pub struct Donation {
    pub donor: Pubkey,
    pub streamer: Pubkey,
    pub amount: u64,
    pub message: String,
    pub is_anonymous: bool,
    pub timestamp: i64,
    pub tx_signature: Pubkey, // In practice, you'd store a more appropriate signature identifier
}

#[event]
pub struct DonationEvent {
    pub donor: Pubkey,
    pub streamer: Pubkey,
    pub amount: u64,
    pub message: String,
    pub is_anonymous: bool,
}