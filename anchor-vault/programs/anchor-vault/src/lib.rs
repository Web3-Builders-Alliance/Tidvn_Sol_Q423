use anchor_lang::prelude::*;

declare_id!("BLwzEcX8xskaPVuvrukaNkmY9624YedqBh19H5LdRoQB");

#[program]
pub mod anchor_vault {
    use anchor_lang::system_program::{transfer, Transfer};

    use super::*;

    pub fn deposit(ctx: Context<Vault>, lamports: u64) -> Result<()> {
        let accounts: Transfer<'_> = Transfer {
            from: ctx.accounts.signer.to_account_info(),
            to: ctx.accounts.vault.to_account_info()
        };

        let transfer_ctx = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            accounts
        );
        
        transfer(transfer_ctx, lamports)
    }
    pub fn withdraw(ctx: Context<Vault>, lamports: u64) -> Result<()> {
        let accounts = Transfer {
            from: ctx.accounts.vault.to_account_info(),
            to: ctx.accounts.signer.to_account_info()
        };

        let bump = [ctx.bumps.vault]; 

        let signer_seeds = [&[
            b"vault", 
            ctx.accounts.signer.to_account_info().key.as_ref(),
            &bump
        ][..]];

        let transfer_ctx = CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(),
            accounts,
            &signer_seeds
        );
        
        transfer(transfer_ctx, lamports)
    }

}

#[derive(Accounts)]
pub struct Vault<'info>{
    #[account(mut)]
    signer: Signer<'info>,
    #[account(
        mut, 
        seeds = [b"vault", signer.key().as_ref()],
        bump,  
    )]
    vault: SystemAccount<'info>,
    system_program: Program<'info, System>
}