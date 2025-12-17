
import { client } from './services/redis.js';
import cron from "node-cron";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const deleteExpiredfiles = async() =>{
    const now = Date.now()

    const expiredOTP = await client.zRangeByScore(
        "otp_expiry",
        0,
        now
    )

    if(expiredOTP.length===0){
        console.log("No Expired OTP's to clean")
        return;
    }

    let totalDeleted = 0;

    for(const item of expiredOTP){
        try{
            const { path } = JSON.parse(item);
            if (!path) {
                await client.zRem("otp_expiry", item);
                continue;
            }

            const { error } = await supabase.storage
                .from("shareout")
                .remove([path]);

            if (error) {
                console.error(`Failed to delete ${path}:`, error.message);
                continue;
            }

            console.log(`Deleted file: ${path}`);
            totalDeleted++;

            await client.zRem("otp_expiry", item);
        }catch(err){
            console.error(`Cleanup failed for Item ${item}`, err.message);
        }
    }
    if (totalDeleted > 0) {
        console.log(`Cleanup completed: deleted ${totalDeleted} expired files`);
    }
}


export function cleanUpExpiredfiles(){
    cron.schedule("*/3 * * * *", async () => {
    console.log("Running cleanup cron...");
    await deleteExpiredfiles();
});
}
