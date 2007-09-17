
	<?php if ($wordpress->have_posts()) : ?>
		
		<?php #pr($wordpress);
		?>
		
		<!-- HOME / BLOG INDEX --> 
		<?php if($wordpress->is_date): ?>
			<?php include(BP_BASEDIR.DS.'templates'.DS.'index.php'); ?>
		<?php endif; ?>
		
		<!-- WORDPRESS PAGE -->
		<?php if($wordpress->is_page): ?>
			<?php include(BP_BASEDIR.DS.'templates'.DS.'page.php'); ?>
		<?php endif; ?>
		
		<!-- SINGLE BLOG POST -->
		<?php if($wordpress->is_single): ?>
			<?php include(BP_BASEDIR.DS.'templates'.DS.'post.php'); ?>
		<?php endif; ?>
		
		<!-- ARCHIVE PAGE -->
		<?php if($wordpress->is_archive): ?>
			<?php include(BP_BASEDIR.DS.'templates'.DS.'archive.php'); ?>
		<?php endif; ?>
		
		<!-- SEARCH RESULT -->
		<?php if($wordpress->is_search): ?>
			<?php include(BP_BASEDIR.DS.'templates'.DS.'search.php'); ?>
		<?php endif; ?>
		
	<?php else : ?>
		
		<!-- NOT FOUND / 404 -->
		<?php if($wordpress->is_search): ?>
			<?php include(BP_BASEDIR.DS.'templates'.DS.'notfound.php'); ?>
		<?php endif; ?>
		
	<?php endif; ?>

