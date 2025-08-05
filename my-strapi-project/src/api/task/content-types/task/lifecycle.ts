import { AzureOpenAI } from 'openai';

const openai = new AzureOpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  endpoint: process.env.ENDPOINT_URL,
  apiVersion: process.env.API_VERSION,
});

export const taskLifecycleHooks = {
  async afterCreate(event: any) {
    const { result } = event;
    
    try {
      if (result.long_text && !result.summary) {
        console.log('Generating summary for task:', result.id);
        
        const completion = await openai.chat.completions.create({
          model: process.env.DEPLOYMENT_NAME,
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that creates concise summaries. Generate a brief, informative summary of the given text in 2-3 sentences."
            },
            {
              role: "user",
              content: `Please summarize the following text: ${result.long_text}`
            }
          ],
          temperature: 1,
        });

        const summary = completion.choices[0]?.message?.content?.trim();
        
        if (summary) {
          await strapi.db.query('api::task.task').update({
            where: { id: result.id },
            data: {
              summary: summary
            }
          });
          console.log('Summary generated and saved for task:', result.id);
        }
      }
    } catch (err) {
      console.error('Error generating summary:', err.message);
    }
  }
}; 